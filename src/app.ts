import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";

// ---------- Route Imports ----------
import authRoutes from "./routes/auth.routes";

import vendorAuthRoutes from "./routes/vendor-auth.routes";
import vendorProductsRoutes from "./routes/vendor-products.routes";
import vendorOrdersRoutes from "./routes/vendor-orders.routes"; // ✅ ADD THIS

import ordersRoutes from "./routes/orders.routes";

import paymentsRoutes, { paystackWebhookHandler } from "./routes/payments.routes";
import productsRoutes from "./routes/products.routes";

import adminUsersRoutes from "./routes/admin-users.routes";
import adminVendorsRoutes from "./routes/admin-vendors.routes";
import adminOrdersRoutes from "./routes/admin-orders.routes";

import logisticsRoutes from "./routes/logistics.routes";
import path from "path";
import wishlistRoutes from "./routes/wishlist.routes";
import fxRoutes from "./routes/fx.routes";
import adminFxRoutes from "./routes/admin-fx.routes";
import adminProductsRoutes from "./routes/admin-products.routes";





const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ======================================================
// 🔵 Core Middleware
// ======================================================
app.use(
  cors({
    origin: "*", // can tighten later
  })
);

app.use(morgan("dev"));

// ======================================================
// 🔵 Paystack Webhook (RAW BODY) — MUST COME BEFORE express.json()
// ======================================================
app.post(
  "/api/payments/paystack/webhook",
  express.raw({ type: "application/json" }),
  paystackWebhookHandler
);

// ======================================================
// 🔵 JSON Body Parsers for normal endpoints
// ======================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================================
// 🔵 PUBLIC USER ROUTES
// ======================================================
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);

app.use("/api/products", productsRoutes);

// ======================================================
// 🔵 VENDOR ROUTES
// ======================================================
app.use("/api/vendor/auth", vendorAuthRoutes);
app.use("/api/vendor/products", vendorProductsRoutes);
app.use("/api/vendor/orders", vendorOrdersRoutes); // ✅ ADD THIS

// ======================================================
// 🔵 ADMIN ROUTES (split into separate files)
// ======================================================
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/vendors", adminVendorsRoutes);
app.use("/api/admin/orders", adminOrdersRoutes);

// ======================================================
// 🔵 LOGISTICS ROUTES (Vendor + User + Admin deliveries)
// ======================================================
app.use("/api", logisticsRoutes);



app.use("/api/wishlist", wishlistRoutes);

app.use("/api/fx", fxRoutes);

app.use("/api/admin/fx", adminFxRoutes);

app.use("/api/admin/products", adminProductsRoutes);


// ======================================================
// 🔵 Health Check
// ======================================================
app.get("/healthz", (req, res) => {
  res.json({ ok: true, env: env.NODE_ENV || "development" });
});

// ======================================================
// 🔴 404 Handler
// ======================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// ======================================================
// 🔴 Global Error Handler
// ======================================================
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error middleware:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;
