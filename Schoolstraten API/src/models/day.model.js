const { Schema, model } = require("mongoose");
const { PeriodSchema } = require("./period.model");

const DaySchema = new Schema(
  {
    weekday: { type: Number, min: 0, max: 6, required: true },
    periods: { type: [PeriodSchema], required: true }
  },
  { timestamps: false, _id: false }
);

const DayModel = model("Day", DaySchema);

module.exports = { DaySchema, DayModel };
