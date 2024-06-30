const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  console.log("handle login ");
  console.log(req.body);
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res
      .status(400)
      .json({ message: "Required credentials are missing" });

  const foundUser = await User.findOne({
    email,
    roles: { $in: [role] },
  }).exec();

  if (!foundUser) return res.sendStatus(401); //Unauthorized
  console.log("🚀 ~ handleLogin ~ foundUser:", foundUser);

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  console.log("🚀 ~ handleLogin ~ match:", match);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      { 
        UserInfo: {
          email: foundUser.email,
          roles: roles,
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
    res.json({ user: foundUser, accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
