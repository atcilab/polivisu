const router = require("express").Router();
const { ProjectCityModel } = require("../models/projectCity.model");

// Create city
router.post("/", async (request, response, next) => {
  try {
    const city = await new ProjectCityModel(request.body).save();
    return response.status(201).json({ message: "City added", city });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Something went wrong!", error });
  }
});

// Get Cities
router.get("/", async (request, response, next) => {
  try {
    const cities = await ProjectCityModel.find();
    return response.status(200).json({ cities });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Something went wrong!", error });
  }
});

// Get City
router.get("/:id", async (request, response, next) => {
  const { id } = request.params;

  try {
    const city = await ProjectCityModel.findById(id);
    if (!city)
      return response.status(404).json({ message: "City does not exist" });
    return response.status(200).json({ city });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Something went wrong", error });
  }
});

// Update City
router.patch("/:id", async (request, response, next) => {
  const { id } = request.params;

  try {
    const updated = await ProjectCityModel.findOneAndUpdate(
      { _id: id },
      request.body,
      { new: true }
    );
    return response
      .status(200)
      .json({ message: "City updated", city: updated });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Something went worng!", error });
  }
});

// Delete City
router.delete("/:id", async (request, response, next) => {
  const { id } = request.params;

  try {
    const deleted = await ProjectCityModel.findOneAndRemove({ _id: id });
    return response.status(200).json({ message: "City deleted" });
  } catch (error) {
    return response
      .status(400)
      .json({ message: "Something went wrong trying to delete a city", error });
  }
});

module.exports = router;
