const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const contactRoute = require("./routes/contactRoute");
const cartRoute = require("./routes/cartRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const reviewRoute = require("./routes/reviewRoute");
const adminRoute = require("./routes/adminRoute");
const newsletterRoute = require("./routes/newsletterRoute");
const materialRoute = require("./routes/materialRoute");
const partnerRoute = require("./routes/partnersRoute");
const catalogueRoute = require("./routes/catalogueRoute");
const homeSliderRoute = require("./routes/homeSliderRoute");
const testimonialRoute = require("./routes/testimonialRoute");
const popupRoute = require("./routes/popupRoute");
const giftCardRoute = require("./routes/giftCardRoute");
const profileRoute = require("./routes/profileRoute");
const hisaabRoute = require("./routes/hisaabRoute");
const schemeRoute = require("./routes/schemeRoute");
var path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { getBanners } = require("./controllers/adminControllers");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { stripeWebhook } = require("./controllers/webhookControllers");
dotenv.config();

connectDB();
const app = express();

// app.use(
//   cors({
//     origin: [
//       // "https://canx.vercel.app",
//       "http://localhost:5173",
//       // "https://api.satpurabio.com",
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "https://canx.vercel.app", // Allow only frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials (important for cookies/sessions)
  })
);

app.options("*", cors()); // Handle preflight requests globally

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://canx.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});


app.get('/', (req, res) => {
  res.send('Hello, Satpura Backend!');
});

app.use("/images", express.static("images"));
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use(bodyParser.json());

app.get("/banner", getBanners);
app.use("/auth", userRoute);
app.use("/product", productRoute);
app.use("/order", orderRoute);
app.use("/contact", contactRoute);
app.use("/cart", cartRoute);
app.use("/wishlist", wishlistRoute);
app.use("/review", reviewRoute);
app.use("/admin", adminRoute);
app.use("/subscribe", newsletterRoute);
app.use("/material", materialRoute);
app.use("/partners", partnerRoute);
app.use("/catalogue", catalogueRoute);
app.use("/slider", homeSliderRoute);
app.use("/popup", popupRoute);
app.use("/testimonial", testimonialRoute);
app.use("/giftcard", giftCardRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/profile", profileRoute);
app.use("/hisaab", hisaabRoute);
app.use("/scheme", schemeRoute)


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`)); 
