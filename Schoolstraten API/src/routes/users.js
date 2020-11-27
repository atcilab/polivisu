const router = require("express").Router();
const { UserModel } = require("../models/user.model");
const { isAuthorized, isAdmin } = require("../guards/auth");

// Get all users
router.get("/", [isAuthorized, isAdmin], async (request, repsonse, next) => {
  try {
    const users = await UserModel.find();
    return repsonse.status(200).json({ users });
  } catch (error) {
    return repsonse
      .status(400)
      .json({ message: "Error while fetcing the users", error });
  }
});

// Update user
router.patch(
  "/:id",
  [isAuthorized, isAdmin],
  async (request, repsonse, next) => {
    const { id } = request.params;
    const body = request.body;

    try {
      const user = await UserModel.findOneAndUpdate({ _id: id }, body, {
        new: true,
      });
      return repsonse.status(200).json({ message: "User updated", user });
    } catch (error) {
      return repsonse
        .status(400)
        .json({ message: "Something went wrong!", error });
    }
  }
);

// Delete user
router.delete("/:id", async (request, repsonse, next) => {
  const { id } = request.params;
  // return repsonse.status(200).json({ id });
  try {
    const user = await UserModel.findOneAndRemove({ _id: id });
    return repsonse.status(200).json({ message: "User deleted!" });
  } catch (error) {
    console.log({ error });

    return repsonse
      .status(400)
      .json({ message: "Something went wrong!", error });
  }
});

module.exports = router;
