import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Invoice } from "@shared/schema";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Receipt, FileText, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ReportMensiliPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { data: invoices = [], isLoading, refetch } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  const downloadPDF = async (report: Invoice) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('SeaBoo - Report Mensile', 20, 20);

    doc.setFontSize(12);
    doc.text(`Numero: ${report.invoiceNumber}`, 20, 40);
    doc.text(`Periodo: ${report.periodStart || ''} - ${report.periodEnd || ''}`, 20, 50);
    doc.text(`Intestatario: ${report.customerName || ''}`, 20, 60);
    doc.text(`Email: ${report.customerEmail || ''}`, 20, 70);

    doc.setFontSize(14);
    doc.text('Riepilogo Finanziario', 20, 90);

    doc.setFontSize(12);
    doc.text(`Ricavi lordi: €${report.subtotal}`, 20, 105);
    doc.text(`Commissioni SeaBoo (15%): -€${report.commission || '0.00'}`, 20, 115);
    doc.text(`Netto spettante: €${report.total}`, 20, 125);

    if (report.notes) {
      doc.text(`Note: ${report.notes}`, 20, 145);
    }

    doc.setFontSize(10);
    doc.text('Documento generato da SeaBoo - Piattaforma Noleggio Barche', 20, 280);

    doc.save(`${report.invoiceNumber}.pdf`);
    toast({ title: "PDF scaricato", description: `${report.invoiceNumber}.pdf` });
  };

  const downloadExcel = (report: Invoice) => {
    const csvContent = [
      ['SeaBoo - Report Mensile'],
      [],
      ['Numero Report', report.invoiceNumber],
      ['Periodo Inizio', report.periodStart || ''],
      ['Periodo Fine', report.periodEnd || ''],
      ['Intestatario', report.customerName || ''],
      ['Email', report.customerEmail || ''],
      ['P.IVA', report.customerVatNumber || ''],
      [],
      ['RIEPILOGO FINANZIARIO'],
      ['Ricavi Lordi', `€${report.subtotal}`],
      ['Commissioni SeaBoo (15%)', `-€${report.commission || '0.00'}`],
      ['Netto Spettante', `€${report.total}`],
      [],
      ['Note', report.notes || ''],
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.invoiceNumber}.csv`;
    link.click();
    toast({ title: "Excel scaricato", description: `${report.invoiceNumber}.csv` });
  };

  const generateReportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/invoices/generate-monthly-report', {
        year: selectedYear,
        month: selectedMonth,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report generato",
        description: `Report mensile per ${selectedMonth}/${selectedYear} generato con successo`,
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile generare il report",
        variant: "destructive",
      });
    },
  });

  const monthlyReports = invoices.filter(i => i.type === 'owner_monthly_report');

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profilo">
            <a className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </a>
          </Link>
          <Receipt className="h-6 w-6 text-orange-500" />
          <h1 className="text-xl font-bold text-gray-900">Report mensili</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-orange-500" />
                  Genera nuovo report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Genera un report mensile con il riepilogo dei guadagni, le commissioni trattenute e il netto a te spettante.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <Label>Mese</Label>
                    <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((name, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 min-w-[120px]">
                    <Label>Anno</Label>
                    <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2024, 2025, 2026].map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => generateReportMutation.mutate()}
                      disabled={generateReportMutation.isPending}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {generateReportMutation.isPending ? 'Generazione...' : 'Genera report'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {monthlyReports.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Report precedenti</h3>
                {monthlyReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <FileText className="h-5 w-5 text-orange-500" />
                            <h3 className="text-lg font-semibold">{report.invoiceNumber}</h3>
                            <Badge className="bg-green-100 text-green-800">Emesso</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Periodo</p>
                              <p className="font-medium">
                                {report.periodStart && report.periodEnd
                                  ? `${format(new Date(report.periodStart), "dd MMM", { locale: it })} - ${format(new Date(report.periodEnd), "dd MMM yyyy", { locale: it })}`
                                  : 'N/A'
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Ricavi lordi</p>
                              <p className="font-medium">€{report.subtotal}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Commissioni (15%)</p>
                              <p className="font-medium text-red-600">-€{report.commission || '0.00'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Netto</p>
                              <p className="font-medium text-green-600 text-lg">€{report.total}</p>
                            </div>
                          </div>

                          {report.notes && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                              {report.notes}
                            </div>
                          )}

                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadPDF(report)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Scarica PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadExcel(report)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Scarica Excel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun report</h3>
                  <p className="text-gray-600">
                    Non hai ancora generato nessun report mensile. Seleziona un mese e genera il tuo primo report!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
