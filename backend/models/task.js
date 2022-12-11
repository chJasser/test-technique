const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const TaskSchema = new Schema(
  {
    title: {
      type: String,
    },

    description: {
      type: String,
      maxLength: 300,
    },
    finished: {
      type: Boolean,
      default: false,
    },
    finished_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = Task = mongoose.model("Task", TaskSchema);
