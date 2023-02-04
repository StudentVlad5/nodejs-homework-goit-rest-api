const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { handleDbSchemaError } = require("../middleware/handleDbSchemaError");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      unique: [true, " name must be unique"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleDbSchemaError);
const ContactSchema = mongoose.model("contact", contactSchema);

module.exports = {ContactSchema};
