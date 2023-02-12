const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationSchema = Schema({
  active: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    required: true, 
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

const VerificationSchema = mongoose.model("verification", verificationSchema);

module.exports = { VerificationSchema };