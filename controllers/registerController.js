const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { email, password, name, citizenship, RPP, role } = req.body;
  console.log("🚀 ~ handleNewUser ~ req.body:", req.body);

  if (!email || !password || !name || !citizenship || !RPP)
    return res.status(400).json({ message: "Reuqired Info not provided" });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ email: email }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      email,
      password: hashedPwd,
      name,
      citizenship,
      roles: [role],
      RPP,
    });

    res.status(201).json({ success: `New user ${name} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
