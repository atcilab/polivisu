const { verify } = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

async function isAuthorized(request, response, next) {
  const token = request.header("Authorization");
  if (!token) return response.status(401).json({ message: "Access denied" });

  try {
    const decocedToken = verify(
      token.replace(/^Bearer\s/, ""),
      process.env.TOKEN_SECRET
    );
    const user = await UserModel.findOne({ _id: decocedToken._id });
    request.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    console.log(error);

    return response.status(401).json({ message: "Unauthorized user", error });
  }
}

async function isCreator(request, response, next) {
  const { id, role } = request.user;

  console.log({ id, role });
  if (role === "user")
    return response.status(401).json({
      message: "You don't have privillages for this",
      guard: "isCreator",
    });
  else {
    next();
  }
}

async function isAdmin(request, response, next) {
  const { id, role } = request.user;
  if (role !== "admin")
    return response.status(401).json({
      message: "You don't have privillages for this",
      guard: "isAdmin",
    });
  else {
    next();
  }
}

module.exports = { isAuthorized, isCreator, isAdmin };
