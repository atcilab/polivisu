const { Schema, model } = require("mongoose");

const ProjectCitySchema = new Schema(
  {
    cityName: { type: String, required: true },
    cityLogo: { type: String },
  },
  { timestamps: false, versionKey: false }
);

const ProjectCityModel = model("ProjectCity", ProjectCitySchema);

module.exports = { ProjectCitySchema, ProjectCityModel };
