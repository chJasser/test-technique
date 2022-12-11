const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UtilisatuerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    confirmationCode: {
      type: String,
      default: null,
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
  },

  { timestamps: true }
);
module.exports = Utilisateur = mongoose.model("Utilisateur", UtilisatuerSchema);
