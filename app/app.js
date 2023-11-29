import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();
import express from 'express';
import dbConnect from '../config/dbConnect.js';
import { globalErrhandler, notFound } from '../middlewares/globalErrHandler.js';
import userRoutes from '../routes/userRoute.js';
import productRoutes from '../routes/productRoute.js';
import categoryRoutes from '../routes/categoryRoute.js';
import brandRouters from '../routes/brandRoute.js';
import colorRouters from '../routes/colorRoute.js';
import reviewRouters from '../routes/reviewRoute.js';
import orderRouters from '../routes/orderRoute.js';
import coupanRouters from '../routes/coupanRoute.js';
import Order from '../model/Order.js';

dbConnect();
const app = express();

//stripe webhook
const stripe = new Stripe(process.env.STRIPE_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_9d3b216cf8746fb6abe2099af5996c38a469f34336814a9a0a59e3839a2cf938";

app.post(
  "/webhook",
  express.raw({type: 'application/json'}),
  async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if(event.type === "checkout.session.completed"){
    //update the order
    const session = event.data.object;
    const { orderId } = session.metadata;
    const paymentStatus = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const totalAmount = session.amount_total;
    const currency = session.currency;

    //find the order
    const order = await Order.findByIdAndUpdate(
      JSON.parse(orderId),
      {
        totalPrice: totalAmount / 100,
        currency,
        paymentMethod,
        paymentStatus,
      },
      {
        new: true,
      }
    );

  }else{
    return;
  }

  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));

//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productRoutes);
app.use("/api/v1/categories/", categoryRoutes);
app.use("/api/v1/brands/", brandRouters);
app.use("/api/v1/colors/", colorRouters);
app.use("/api/v1/reviews/", reviewRouters);
app.use("/api/v1/orders/", orderRouters);
app.use("/api/v1/coupans/", coupanRouters);

//err middleware
app.use(notFound);
app.use(globalErrhandler);
export default app;