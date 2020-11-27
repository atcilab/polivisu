const { Schema, model } = require("mongoose");
const { DaySchema } = require("./day.model");
const { RoadSegmentSchema } = require("./roadSegment.model");

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    address: { type: String, default: "" },
    image: { type: String },
    schoolStreetCamera: { type: RoadSegmentSchema, required: true },
    neighbouringStreetCameras: { type: [RoadSegmentSchema], required: true },
    isActive: { type: Boolean, default: false },
    isActiveSince: { type: Date, default: null },
    activeHoursPerDay: { type: [DaySchema], required: true },
    numberOfBikes: { type: Number, required: true },
    website: { type: String, default: null },
    roadNames: { type: [RoadSegmentSchema], required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false }
);

ProjectSchema.pre("save", function (next) {
  const project = this;
  project.roadNames = [
    ...new Set([
      project.schoolStreetCamera,
      ...project.neighbouringStreetCameras,
    ]),
  ];

  next();
});

const ProjectModel = model("Project", ProjectSchema);

module.exports = { ProjectSchema, ProjectModel };
