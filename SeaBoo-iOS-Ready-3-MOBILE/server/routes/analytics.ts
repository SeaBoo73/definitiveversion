import { Router } from 'express';
import { db } from '../db';
import { boats, bookings, users, reviews } from '@shared/schema';
import { eq, and, between, sql, desc, asc } from 'drizzle-orm';
import { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth, startOfYear, format } from 'date-fns';

const router = Router();

// Analytics registration function to be called in routes.ts
export function registerAnalyticsRoutes(app: any) {
  app.use('/api/analytics', router);
}

// GET /api/analytics - Main analytics dashboard data
router.get('/', async (req, res) => {
  try {
    const { from, to, period = 'month' } = req.query;
    const fromDate = new Date(from as string || startOfMonth(new Date()));
    const toDate = new Date(to as string || new Date());

    // Calculate previous period for comparison
    const periodDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const prevFromDate = subDays(fromDate, periodDays);
    const prevToDate = subDays(toDate, periodDays);

    // Overview metrics
    const [currentMetrics] = await db.select({
      totalRevenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      totalBookings: sql<number>`COUNT(${bookings.id})`,
      totalBoats: sql<number>`COUNT(DISTINCT ${bookings.boatId})`,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`
    }).from(bookings)
      .leftJoin(reviews, eq(bookings.id, reviews.bookingId))
      .where(and(
        between(bookings.createdAt, fromDate, toDate),
        eq(bookings.status, 'confirmed')
      ));

    const [prevMetrics] = await db.select({
      totalRevenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      totalBookings: sql<number>`COUNT(${bookings.id})`
    }).from(bookings)
      .where(and(
        between(bookings.createdAt, prevFromDate, prevToDate),
        eq(bookings.status, 'confirmed')
      ));

    // Calculate growth percentages
    const revenueGrowth = prevMetrics.totalRevenue > 0 
      ? ((currentMetrics.totalRevenue - prevMetrics.totalRevenue) / prevMetrics.totalRevenue) * 100 
      : 0;

    const bookingGrowth = prevMetrics.totalBookings > 0 
      ? ((currentMetrics.totalBookings - prevMetrics.totalBookings) / prevMetrics.totalBookings) * 100 
      : 0;

    // Revenue data over time
    const revenueData = await getRevenueDataByPeriod(fromDate, toDate, period as string);

    // Boat performance data
    const boatPerformance = await db.select({
      boatId: boats.id,
      boatName: boats.name,
      revenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      bookings: sql<number>`COUNT(${bookings.id})`,
      rating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      occupancyRate: sql<number>`
        CASE 
          WHEN COUNT(${bookings.id}) > 0 
          THEN (COUNT(${bookings.id}) * 100.0 / ${periodDays})
          ELSE 0 
        END
      `
    }).from(boats)
      .leftJoin(bookings, and(
        eq(boats.id, bookings.boatId),
        between(bookings.createdAt, fromDate, toDate),
        eq(bookings.status, 'confirmed')
      ))
      .leftJoin(reviews, eq(bookings.id, reviews.bookingId))
      .groupBy(boats.id, boats.name)
      .orderBy(desc(sql`SUM(${bookings.totalPrice})`))
      .limit(20);

    // Category statistics
    const categoryStats = await db.select({
      category: boats.type,
      revenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      bookings: sql<number>`COUNT(${bookings.id})`,
      avgPrice: sql<number>`COALESCE(AVG(${bookings.totalPrice}), 0)`
    }).from(boats)
      .leftJoin(bookings, and(
        eq(boats.id, bookings.boatId),
        between(bookings.createdAt, fromDate, toDate),
        eq(bookings.status, 'confirmed')
      ))
      .groupBy(boats.type)
      .orderBy(desc(sql`SUM(${bookings.totalPrice})`));

    // Fiscal data calculation
    const totalIncome = Number(currentMetrics.totalRevenue);
    const platformCommission = totalIncome * 0.15; // 15% commission
    const netIncome = totalIncome - platformCommission;
    const taxableIncome = netIncome * 0.85; // Assuming 15% deductible expenses
    const estimatedTaxes = taxableIncome * 0.22; // 22% tax rate

    const fiscalData = {
      totalIncome,
      platformCommission,
      netIncome,
      taxableIncome,
      estimatedTaxes
    };

    const overview = {
      totalRevenue: Number(currentMetrics.totalRevenue),
      totalBookings: Number(currentMetrics.totalBookings),
      totalBoats: Number(currentMetrics.totalBoats),
      avgRating: Number(currentMetrics.avgRating),
      revenueGrowth,
      bookingGrowth
    };

    res.json({
      overview,
      revenueData,
      boatPerformance,
      categoryStats,
      fiscalData
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Errore caricamento analytics' });
  }
});

// GET /api/analytics/export - Export analytics reports
router.get('/export', async (req, res) => {
  try {
    const { from, to, type = 'pdf' } = req.query;
    const fromDate = new Date(from as string || startOfMonth(new Date()));
    const toDate = new Date(to as string || new Date());

    // Get comprehensive data for export
    const exportData = await getExportData(fromDate, toDate);

    if (type === 'pdf') {
      // Generate PDF report
      const pdf = await generatePDFReport(exportData, fromDate, toDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="report-${format(new Date(), 'yyyy-MM-dd')}.pdf"`);
      res.send(pdf);
    } else if (type === 'excel') {
      // Generate Excel report
      const excel = await generateExcelReport(exportData, fromDate, toDate);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="report-${format(new Date(), 'yyyy-MM-dd')}.xlsx"`);
      res.send(excel);
    } else {
      res.status(400).json({ error: 'Tipo export non supportato' });
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Errore generazione report' });
  }
});

// GET /api/analytics/boat/:id - Individual boat analytics
router.get('/boat/:id', async (req, res) => {
  try {
    const boatId = parseInt(req.params.id);
    const { from, to } = req.query;
    const fromDate = new Date(from as string || startOfMonth(new Date()));
    const toDate = new Date(to as string || new Date());

    // Boat details with owner info
    const [boatDetails] = await db.select({
      id: boats.id,
      name: boats.name,
      type: boats.type,
      port: boats.port,
      pricePerDay: boats.pricePerDay,
      ownerName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      ownerEmail: users.email
    }).from(boats)
      .leftJoin(users, eq(boats.ownerId, users.id))
      .where(eq(boats.id, boatId));

    if (!boatDetails) {
      return res.status(404).json({ error: 'Barca non trovata' });
    }

    // Performance metrics
    const [performance] = await db.select({
      totalRevenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      totalBookings: sql<number>`COUNT(${bookings.id})`,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      totalReviews: sql<number>`COUNT(${reviews.id})`
    }).from(bookings)
      .leftJoin(reviews, eq(bookings.id, reviews.bookingId))
      .where(and(
        eq(bookings.boatId, boatId),
        between(bookings.createdAt, fromDate, toDate),
        eq(bookings.status, 'confirmed')
      ));

    // Monthly breakdown
    const monthlyData = await db.select({
      month: sql<string>`TO_CHAR(${bookings.createdAt}, 'YYYY-MM')`,
      revenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
      bookings: sql<number>`COUNT(${bookings.id})`
    }).from(bookings)
      .where(and(
        eq(bookings.boatId, boatId),
        between(bookings.createdAt, fromDate, toDate),
        eq(bookings.status, 'confirmed')
      ))
      .groupBy(sql`TO_CHAR(${bookings.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${bookings.createdAt}, 'YYYY-MM')`);

    // Recent bookings
    const recentBookings = await db.select({
      id: bookings.id,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      customerName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
      customerEmail: users.email
    }).from(bookings)
      .leftJoin(users, eq(bookings.customerId, users.id))
      .where(and(
        eq(bookings.boatId, boatId),
        between(bookings.createdAt, fromDate, toDate)
      ))
      .orderBy(desc(bookings.createdAt))
      .limit(10);

    // Customer reviews
    const customerReviews = await db.select({
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      customerName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`
    }).from(reviews)
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(and(
        eq(reviews.boatId, boatId),
        between(reviews.createdAt, fromDate, toDate)
      ))
      .orderBy(desc(reviews.createdAt))
      .limit(10);

    res.json({
      boat: boatDetails,
      performance,
      monthlyData,
      recentBookings,
      customerReviews
    });

  } catch (error) {
    console.error('Boat analytics error:', error);
    res.status(500).json({ error: 'Errore caricamento analytics barca' });
  }
});

// Helper function to get revenue data by period
async function getRevenueDataByPeriod(fromDate: Date, toDate: Date, period: string) {
  const formatMap = {
    week: 'YYYY-MM-DD',
    month: 'YYYY-MM-DD', 
    quarter: 'YYYY-MM',
    year: 'YYYY-MM'
  };

  const format = formatMap[period as keyof typeof formatMap] || 'YYYY-MM-DD';

  return await db.select({
    date: sql<string>`TO_CHAR(${bookings.createdAt}, '${format}')`,
    revenue: sql<number>`COALESCE(SUM(${bookings.totalPrice}), 0)`,
    bookings: sql<number>`COUNT(${bookings.id})`
  }).from(bookings)
    .where(and(
      between(bookings.createdAt, fromDate, toDate),
      eq(bookings.status, 'confirmed')
    ))
    .groupBy(sql`TO_CHAR(${bookings.createdAt}, '${format}')`)
    .orderBy(sql`TO_CHAR(${bookings.createdAt}, '${format}')`);
}

// Helper function to get comprehensive export data
async function getExportData(fromDate: Date, toDate: Date) {
  // Get all bookings in period
  const bookingsData = await db.select({
    bookingId: bookings.id,
    customerName: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
    customerEmail: users.email,
    boatName: boats.name,
    boatType: boats.type,
    startDate: bookings.startDate,
    endDate: bookings.endDate,
    totalPrice: bookings.totalPrice,
    commission: bookings.commission,
    status: bookings.status
  }).from(bookings)
    .leftJoin(users, eq(bookings.customerId, users.id))
    .leftJoin(boats, eq(bookings.boatId, boats.id))
    .where(and(
      between(bookings.createdAt, fromDate, toDate),
      eq(bookings.status, 'confirmed')
    ))
    .orderBy(desc(bookings.createdAt));

  return {
    bookings: bookingsData,
    period: { from: fromDate, to: toDate }
  };
}

// PDF Report Generation (placeholder - would need a PDF library like puppeteer or PDFKit)
async function generatePDFReport(data: any, fromDate: Date, toDate: Date) {
  // This would generate a PDF report using a library like PDFKit or Puppeteer
  // For now, return a simple text buffer
  const report = `
SEABOO - REPORT ANALYTICS
Periodo: ${format(fromDate, 'dd/MM/yyyy')} - ${format(toDate, 'dd/MM/yyyy')}

RIEPILOGO PRENOTAZIONI:
Totale prenotazioni: ${data.bookings.length}
Fatturato totale: €${data.bookings.reduce((sum: number, b: any) => sum + Number(b.totalPrice), 0).toLocaleString()}

DETTAGLIO PRENOTAZIONI:
${data.bookings.map((b: any) => 
  `${format(b.startDate, 'dd/MM/yyyy')} - ${b.customerName} - ${b.boatName} - €${b.totalPrice}`
).join('\n')}
  `;
  
  return Buffer.from(report, 'utf8');
}

// Excel Report Generation (placeholder - would need a library like exceljs)
async function generateExcelReport(data: any, fromDate: Date, toDate: Date) {
  // This would generate an Excel file using a library like exceljs
  // For now, return CSV data as buffer
  const headers = 'Data,Cliente,Email,Barca,Tipo,Prezzo,Commissione,Stato\n';
  const rows = data.bookings.map((b: any) => 
    `${format(b.startDate, 'dd/MM/yyyy')},${b.customerName},${b.customerEmail},${b.boatName},${b.boatType},${b.totalPrice},${b.commission},${b.status}`
  ).join('\n');
  
  return Buffer.from(headers + rows, 'utf8');
}

export default router;