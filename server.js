  const express = require("express");
  const cors = require("cors");
  const dotenv = require("dotenv");

  const connectDB = require("./config/db");

  dotenv.config();

  connectDB();

  const app = express();

  const allowedOrigins = [
  "http://localhost:5173",      // Vite
  "http://localhost:3000",      // CRA (if used)
  "https://finesse2.netlify.app", // 🔥 replace with your real Netlify URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
  app.use(express.json());

  app.use("/uploads", express.static("uploads"));

  /* ROUTES */
  app.use("/api/products", require("./routes/productRoutes"));
  app.use("/api/categories", require("./routes/categoryRoutes"));
  app.use("/api/cart", require("./routes/cartRoutes"));
  app.use("/api/wishlist", require("./routes/wishlistRoutes"));
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/user", require("./routes/userRoutes"));
  app.use("/api/orders", require("./routes/orderRoutes"));
  app.use("/api/address", require("./routes/addressRoutes"));


  /* TEST ROUTE */
  app.get("/", (req, res) => {
    res.send("Backend Running...");
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
