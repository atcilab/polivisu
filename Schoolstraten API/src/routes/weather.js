const express = require("express");
const router = express.Router();
const { ItemModel } = require("../models/item.model");

router.get("/", async (request, response, next) => {
  try {
    const items = await ItemModel.find();
    return response.status(200).json(items);
  } catch (error) {
    return response
      .status(500)
      .json({ error, message: "Failed to fetch data from server" });
  }
});

module.exports = router;
