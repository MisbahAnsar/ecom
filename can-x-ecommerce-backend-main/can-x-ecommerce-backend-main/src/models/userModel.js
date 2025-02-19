const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  creditLimit: { type: Number, default: 0 },
  usedCredit: { type: Number, default: 0 },
  shopName: { type: String, required: true },
  // shopNumber: { type: String, required: true },
  shopOwnerName: { type: String, required: true },
  pesticideLicense: { type: String, required: false }, //file
  securityChecksImage: { type: String, required: false }, //file
  dealershipForm: { type: String, required: false }, //file
  shopAddress: { type: String, required: true },
  gstNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  aadharFrontImage: { type: String, required: false },
  aadharBackImage: { type: String, required: false },
  role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
  companyName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  local: {
    password: { type: String },
  },
  google: {
    accountId: { type: String },
  },
  facebook: {
    accountId: { type: String },
  },
  category: { type: String },
  resetOTP: String,
  resetOTPExpires: Date,
  vendorAccess: { type: Boolean, default: false },
  customerAccess: { type: Boolean, default: false },
  couponsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
  totalSpent: { type: Number, default: 0 },
  customerRejected: { type: Boolean },
  availedScheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scheme",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
