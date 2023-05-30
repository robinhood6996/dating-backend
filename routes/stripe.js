const express = require("express");
const Stripe = require("stripe");
const EscortAd = require("../models/escortAds.model");
const Banner = require("../models/banner.model");
require("dotenv").config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const { EscortProfile } = require("../models/escort.model");

function getFutureDate(numberOfDays) {
  // Create a new Date object for the current date
  let currentDate = new Date();

  // Calculate the future date by adding the specified number of days
  let futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + numberOfDays);

  // Return the future date
  return futureDate;
}

router.post("/checkout-payment", async (req, res) => {
  console.log("checkout-body", req.body);
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      userEmail: req.body.userEmail,
      name: req.body.name,
      cart: JSON.stringify(req.body.cartItems),
      type: req.body.type,
      packageType: req.body.packageType,
      duration: req.body.duration,
      price: req.body.price,
      orderId: req.body.orderId,
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

//For Banner advertising
router.post("/checkout-banner", async (req, res) => {
  console.log("checkout-body", req.body);
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      userEmail: req.body.userEmail,
      name: req.body.name,
      cart: JSON.stringify(req.body.cartItems),
      type: req.body.type,
      packageType: req.body.packageType,
      duration: req.body.duration,
      price: req.body.price,
      orderId: req.body.orderId,
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
// let endpointSecret =
//   "whsec_013f5baf84ef59e967095114e698669c4d0627a3684b8dfa35cb6b4eb3a86551";
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
      console.log("event", data);

      stripe.customers
        .retrieve(data.customer)
        .then(async (customer) => {
          try {
            // console.log(type, customer);
            // CREATE ORDER
            createMembershipOrder(customer, data);
            // if (data?.metadata?.type === "escortAd") {
            //   console.log("escortAd");
            //   createMembershipOrder(customer, data);
            // } else if (data?.metadata?.type === "bannerAd") {
            //   addBanner(customer, data);
            // }
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
  console.log("customer", customer, data);
  let paymentDetails = {
    paymentIntentId: data.payment_intent,
    paymentStatus: data.payment_status,
    customerId: data.customer,
    userId: customer.metadata.userId,
  };

  try {
    let Ad = await EscortAd.findOne({ _id: orderDetails?.orderId });
    if (Ad) {
      Ad.paymentDetails = paymentDetails;
      Ad.isPaid = true;
      await Ad.save();
    }
    EscortProfile.findOneAndUpdate(
      {
        username: customer.metadata.userId,
      },
      {
        $addToSet: { memberShip: parseInt(customer.metadata.packageType) },
        memberShipDetails: {
          startDate: getFutureDate(0),
          endDate: getFutureDate(parseInt(customer.metadata.duration)),
        },
      }
    )
      .then((res) => {
        console.log("escort updated");
      })
      .catch((err) => {
        console.log("escort err", err);
      });
  } catch (error) {
    // res.status(500).json({ message: "Failed to create order" });
    console.log(error);
  }
};

const addBanner = async (customer, data) => {
  try {
    const orderDetails = JSON.parse(customer.metadata.cart)[0];
    const username = customer.metadata.userId;
    const {
      position,
      country,
      city,
      duration,
      payAmount,
      name,
      email,
      images,
    } = orderDetails;
    const files = req.file;
    // Check if required fields are provided
    if (
      !position ||
      !country ||
      !city ||
      !duration ||
      !payAmount ||
      !email ||
      !name
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if position is a valid value
    const validPositions = ["top", "left", "right"];
    if (!validPositions.includes(position)) {
      return res.status(400).json({ message: "Invalid position" });
    }

    // Check if duration is a positive number
    if (duration <= 0) {
      return res
        .status(400)
        .json({ message: "Duration must be a positive number" });
    }

    // Check if price is a positive number
    if (payAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    // Check if paymentStatus is a valid value
    let paymentDetails = {
      paymentIntentId: data.paymentIntentId,
      paymentStatus: data.payment_status,
      customerId: data.customer,
      userId: customer.metadata.userId,
    };
    // Create and save the new banner
    const banner = new Banner({
      position,
      country,
      city,
      image: images,
      duration,
      price,
      username,
      email,
      paymentDetails,
      isPaid: true,
      isBank: false,
    });
    await banner.save();

    res.status(201).json({
      banner,
      message: "You purchased banner advertisement successfully",
    });
  } catch (error) {
    console.error(error);

    // If the error is a Mongoose validation error, return the specific error message
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errors.join(", ") });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = router;
