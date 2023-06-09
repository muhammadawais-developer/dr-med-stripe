const router = require("express").Router();
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(
  "sk_test_51HGPdJDfk2XgzKdjYbp2Iq9OmKy8JftRiKqSkXjGPRU2E4s9Z8tD0amU07YtTwJht1eHMX6lFA6lvPZFECsmQRqk00Z8nu2gy3",
  null
);

router.post("/donate", async (req, res) => {
  const { token , amount = 0, name } = req.body;

  if (!Object.keys(token).length || !amount) {
    res.status(400).json({ error: "token not present" });
  }

  const { id: customerId } = await stripe.customers
    .create({
      name: name,
      email: token.email,
      source: token.id,
    })
    .catch((e) => {
      console.log(e);
      return null;
    });

  if (!customerId) {
    res.status(500).json({ error: "customer id not present" });
    return;
  }

  const invoiceId = `${
    token.email
  }-${Math.random().toString()}-${Date.now().toString()}`;

  const charge = await stripe.charges
    .create(
      {
        amount: amount * 100,
        currency: "USD",
        customer: customerId,
        receipt_email: token.email,
        description: "Dr-Meditation-Payment",
      },
      { idempotencyKey: invoiceId }
    )
    .catch((e) => {
      console.log(e);
      return null;
    });

  if (!charge) {
    res.status(500).json({ error: "charge not deducted" });
    return;
  }

  res.status(201).json({ success: true });
});

module.exports = router;
