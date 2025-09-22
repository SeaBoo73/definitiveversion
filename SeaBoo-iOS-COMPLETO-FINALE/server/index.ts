import Stripe from "stripe";
import cors from "cors";
import express, { type Request, Response } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

process.env.REVIEW_MODE = "";
process.env.PAYMENTS_MODE = "";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, _res, next) => { console.log("[REQ]", req.method, req.path); next(); });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

app.post("/api/create-experience-payment", async (req: Request, res: Response) => {
  try {
    const amount = Number(req.body?.amount ?? 100);
    const currency = String(req.body?.currency ?? "eur");
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: "missing_secret" });
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: "bad_amount" });
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });
    return res.status(200).json({ clientSecret: intent.client_secret });
  } catch (e: any) {
    console.error("[PAY][SERVER-ERR]", e?.message || e);
    return res.status(500).json({ error: "stripe_failed" });
  }
});

(async () => {
  const server = await registerRoutes(app);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`🚀 Server running on port ${port}`);
  });
})();
