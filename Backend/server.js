require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminloginRoutes");
const plantRoutes = require("./routes/plantManagementRoutes");
const path = require("path");
const session = require("express-session");
const mongo_session = require("connect-mongo");
const cart = require("./routes/cart.routes");
const wishlist = require("./routes/wishlist.routes");
const make_payment = require("./routes/paymentRoute.routes");
const make_order = require("./routes/Order.routes");
const multer = require("multer");
const bodyParser = require("body-parser");
const profileRoutes = require("./routes/profileRoutes");
const details_form_pincode = require("./routes/PincodeDetails.routes");

app.use(bodyParser.json());

// Middleware (only apply once)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  session({
    secret: "florus",
    store: mongo_session.create({ mongoUrl: process.env.MONGO_URI }),
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/api", require("./routes/contactRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/cart", cart);
app.use("/api/wishlist", wishlist);
app.use("/api/payment", make_payment);
app.use("/api/order", make_order);
app.use("/api/profile", profileRoutes);
app.use("/api/detailsFromPincode", details_form_pincode);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
  } else if (err.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Connect to Database
connectDB();
