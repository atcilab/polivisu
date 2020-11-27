const router = require("express").Router();
const { UserModel } = require("../models/user.model");
const { registerValidator, loginValidator } = require("../validators/user");
const { verify } = require("jsonwebtoken");

router.post("/register", async (request, response, next) => {
  // Validate data before create the user
  const { error } = registerValidator(request.body);
  if (error) {
    const errors = error.details.map((e) => e.message);
    console.log(errors);
    return response.status(400).json({ error: errors });
  }

  // Check if email exists
  const emailCheck = await UserModel.findOne({ email: request.body.email });
  if (emailCheck) {
    return response.status(409).json({ message: "Email already in use" });
  }

  const user = new UserModel(request.body);
  try {
    const saved = await user.save();
    return response.status(200).json({ saved });
  } catch (error) {
    error.status = 400;
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  // Validate data before login the user
  const { error } = loginValidator(request.body);
  if (error) {
    const errors = error.details.map((e) => e.message);
    return response.status(400).json({ error: errors });
  }

  try {
    const user = await UserModel.findUserByCredentials(
      request.body.email,
      request.body.password
    );

    // Check if user is verified
    // if (!user.isVerified)
    //   return response.status(401).json({ message: "Verify your email first" });

    const token = await user.generateToken();
    return response.status(200).json({ token });
  } catch (error) {
    error.status = 401;
    next(error);
  }
});

router.get("/verify", async (request, response, next) => {
  const authorizationHeader = request.headers.authorization || "";
  const token = authorizationHeader.replace(/^Bearer\s/, "");
  verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
    if (error)
      return response.status(401).json({ message: "Token is not valid" });
    return response.status(200);
  });
});

module.exports = router;
