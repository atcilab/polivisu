const { Schema, model } = require("mongoose");
const { hash, genSaltSync, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "creator", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Find user by credentials
UserSchema.statics.findUserByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Email doesn't exists");

  const isValid = await compare(password, user.password);
  if (!isValid) throw new Error("Unable to login!");

  return user;
};

// Generate JWT
UserSchema.methods.generateToken = async function () {
  const user = this;
  const token = sign(
    { _id: user._id.toString(), role: user.role },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  const user = this;
  // It is true at first create
  if (user.isModified("password")) {
    user.password = await hash(user.password, genSaltSync());
  }
  if (user.isModified("firstName")) user.firstName = capitalize(user.firstName);
  if (user.isModified("lastName")) user.lastName = capitalize(user.lastName);

  next();
});

const UserModel = model("User", UserSchema);

const capitalize = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

module.exports = { UserSchema, UserModel };
