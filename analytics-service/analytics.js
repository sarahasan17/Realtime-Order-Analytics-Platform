const express = require("express");
const { MongoClient } = require("mongodb");
const { Kafka } = require("kafkajs");
const path = require("path");

const app = express();
const PORT = 9001;

/* =============================
   MONGODB CONFIG
============================= */

const mongoUrl = "mongodb://mongo:27017";
const client = new MongoClient(mongoUrl);

let db;

/* =============================
   KAFKA CONFIG
============================= */

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: ["kafka:9092"],
});

// 🔥 SAME GROUP ID (important for scaling)
const consumer = kafka.consumer({
  groupId: "analytics-group",
});

/* =============================
   START EVERYTHING
============================= */

async function startServer() {
  try {
    // Connect MongoDB
    await client.connect();
    db = client.db("ordersDB");
    console.log("✅ Connected to MongoDB");

    await db.collection("orders").createIndex({ orderId: 1 }, { unique: true });

    // 🔥 Start Express immediately
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.json());

    app.get("/orders", async (req, res) => {
      try {
        const orders = await db
          .collection("orders")
          .find({})
          .sort({ timestamp: 1 })
          .toArray();

        res.json(orders);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
      }
    });

    app.delete("/reset", async (req, res) => {
      try {
        await db.collection("orders").deleteMany({});
        res.json({ message: "All data cleared" });
      } catch (err) {
        res.status(500).json({ error: "Reset failed" });
      }
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Analytics Service running on port ${PORT}`);
    });

    // 🔥 Start Kafka consumer in background
    startKafkaConsumer();
  } catch (error) {
    console.error("❌ Startup failed:", error);
  }
}

async function startKafkaConsumer() {
  while (true) {
    try {
      console.log("⏳ Trying to connect to Kafka...");

      await consumer.connect();

      await consumer.subscribe({
        topic: "orders",
        fromBeginning: true,
      });

      console.log("✅ Kafka Consumer connected & subscribed");

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const order = JSON.parse(message.value.toString());

            await db
              .collection("orders")
              .updateOne(
                { orderId: order.orderId },
                { $set: order },
                { upsert: true },
              );

            console.log(
              `📥 Stored order ${order.orderId} from partition ${partition}`,
            );
          } catch (err) {
            console.error("❌ Error processing message:", err);
          }
        },
      });

      break; // exit retry loop if successful
    } catch (err) {
      console.error("❌ Kafka not ready. Retrying in 5 seconds...");
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

startServer();