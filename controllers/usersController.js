const User = require("../model/User");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const getAllAdmins = async (req, res) => {
  const users = await User.find({ roles: { $in: "admin" } });
  if (!users) return res.status(204).json({ message: "No admins found" });
  res.json(users);
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: user.email,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  // const refreshToken = jwt.sign(
  //   { username: foundUser.username },
  //   process.env.REFRESH_TOKEN_SECRET,
  //   { expiresIn: "1d" }
  // );
  // Saving refreshToken with current user
  // foundUser.refreshToken = refreshToken;
  // const result = await foundUser.save();

  // Creates Secure Cookie with refresh token
  // res.cookie("jwt", refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  // Send authorization roles and access token to user
  res.json({ user, accessToken });
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  getAllAdmins,
};
