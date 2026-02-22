const express = require("express");
const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 9001;

/* ============================= */
/* STATIC FILES */
/* ============================= */

app.use(express.static(path.join(__dirname, "public")));

/* ============================= */
/* MONGODB CONNECTION */
/* ============================= */

mongoose
  .connect("mongodb://mongo:27017/ordersDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo Error:", err));

const orderSchema = new mongoose.Schema({
  orderId: Number,
  customer: String,
  amount: Number,
  currency: String,
  status: String,
  timestamp: Number,
});

const Order = mongoose.model("Order", orderSchema);

/* ============================= */
/* KAFKA CONSUMER */
/* ============================= */

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const order = JSON.parse(message.value.toString());

        await Order.create(order);

        console.log("Stored:", order);
      } catch (err) {
        console.error("Consumer Error:", err);
      }
    },
  });
}

runConsumer();

/* ============================= */
/* API ROUTE */
/* ============================= */

app.get("/orders", async (req, res) => {
  const data = await Order.find().sort({ orderId: -1 });
  res.json(data);
});

/* ============================= */
/* START SERVER */
/* ============================= */

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
});
