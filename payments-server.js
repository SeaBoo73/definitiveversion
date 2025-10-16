import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_xxx");

app.get("/health", (_, res) => res.send("ok"));

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, currency = "eur", description = "SeaBoo booking",
            success_url = "https://example.com/success",
            cancel_url = "https://example.com/cancel" } = req.body || {};
    if (!amount) return res.status(400).json({ error: "amount (cents) required" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency, product_data: { name: description }, unit_amount: amount }, quantity: 1 }],
      success_url, cancel_url
    });
    res.json({ url: session.url });
  } catch (e) { console.error(e); res.status(500).json({ error: "stripe_error", details: e.message }); }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`✅ Stripe payments server on http://localhost:${port}`));
