const express = require("express");
const Stripe = require("stripe");
const EscortAd = require("../models/escortAds.model");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/checkout-payment", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      userEmail: req.body.userEmail,
      name: req.body.name,
      cart: JSON.stringify(req.body.cartItems),
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: item.desc,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  // res.redirect(303, session.url);
  res.send({ url: session.url });
});

//Webhook
let endpointSecret =
  "whsec_013f5baf84ef59e967095114e698669c4d0627a3684b8dfa35cb6b4eb3a86551";
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;

    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            console.log(customer);
            // CREATE ORDER
            createMembershipOrder(customer, data);
          } catch (err) {
            console.log(typeof createOrder);
            console.log(err);
          }
        })
        .catch((err) => console.log(err.message));
    }
    res.status(200).end();
  }
);

const createMembershipOrder = async (customer, data) => {
  const orderDetails = JSON.parse(customer.metadata.cart)[0];
  let packageType = orderDetails.name.includes("VIP")
    ? 1
    : orderDetails.name.includes("Featured")
    ? 2
    : orderDetails.name.includes("month")
    ? 3
    : 4;
  let paymentMedia = "card";
  let paymentDetails = {
    paymentIntentId: data.paymentIntentId,
    paymentStatus: data.payment_status,
    customerId: data.customer,
    userId: customer.metadata.userId,
  };

  let escortAd = new EscortAd({
    name: customer.metadata.name,
    email: customer.metadata.userEmail,
    username: customer.metadata.userId,
    packageType,
    duration: orderDetails.duration,
    payAmount: data.amount_total,
    isPaid: true,
    paymentMedia,
    paymentDetails,
  });
  try {
    let ad = await escortAd.save();
    console.log("processed ad:", ad);
    // res.status(200).send({ message: "Membership purchase successfully" });
  } catch (error) {
    // res.status(500).json({ message: "Failed to create order" });
    console.log(error);
  }
};

module.exports = router;
