import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleSleepAssistant,
  handleScheduleGeneration,
  handleMorningRoutineGeneration,
} from "./routes/sleep-assistant";
import { handleStripeWebhook, manualSubscriptionUpdate } from "./routes/stripe-webhook";
import { createCheckoutSession } from "./routes/stripe-checkout";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());

  // Stripe webhook needs raw body, so handle it before JSON parsing
  app.post("/api/stripe-webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

  // Regular JSON middleware for other routes
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/sleep-assistant", handleSleepAssistant);
  app.post("/api/generate-schedule", handleScheduleGeneration);
  app.post("/api/generate-morning-routine", handleMorningRoutineGeneration);

  // Manual subscription update endpoint (for testing)
  app.post("/api/update-subscription", manualSubscriptionUpdate);

  // Stripe checkout session endpoint
  app.post("/api/create-checkout-session", createCheckoutSession);

  return app;
}
