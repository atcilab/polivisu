const { Schema, model } = require("mongoose");

const PeriodSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { timestamps: false, _id: false }
);

const PeriodModel = model("Period", PeriodSchema);

module.exports = { PeriodSchema, PeriodModel };
