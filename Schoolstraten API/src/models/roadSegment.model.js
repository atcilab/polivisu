const { Schema, model } = require("mongoose");

const RoadSegmentSchema = new Schema(
  {
    id: Number,
    address: String
  },
  { timestamps: false, _id: false }
);

const RoadSegmentModel = model("RoadSegment", RoadSegmentSchema);

module.exports = { RoadSegmentSchema, RoadSegmentModel };
