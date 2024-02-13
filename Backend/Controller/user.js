const { validationResult } = require("express-validator");
const user = require("../model/user");
const { encodePassword, setToken, comparePassword } = require("../MWR/helper");
const postUser = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success: -1, error: error.mapped() });
    }
    const { email, password, name } = req.body;
    const client = await user.findOne({ email });
    if (client) {
      return res.status(400).json({
        success: -2,
        error: "Email is already in use in another account",
      });
    }
    const hashPassword = await encodePassword(password);
    const storeUser = await user.create({
      userName: name,
      email,
      password: hashPassword,
    });
    const token = setToken(storeUser._id);
    res.cookie("token", token,{httpOnly:true,domain:process.env.domain,sameSite:"None",secure:true});
    res
      .status(201)
      .json({ success: 1, name: storeUser.userName, email: storeUser.email,token });
  } catch (error) {
    console.log("error-", error);
    res.status(500).json({ success: 0, error });
  }
};

const getUser = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success: -1, error: error.mapped() });
    }
    const { email, password } = req.query;
    console.log(req.query);
    const client = await user.findOne({ email });
    console.log(client);

    if (!client) {
      return res.status(400).json({
        success: -2,
        error: "Email is not found",
      });
    }
    const hashPassword = await comparePassword(password, client.password);
    if (!hashPassword) {
      return res.status(400).json({ success: -3, error: "Password is wrong" });
    }
    const token = setToken(client._id);
    res.cookie("token", token,{httpOnly:true,domain:process.env.domain,sameSite:"None",secure:true});
    res
      .status(201)
      .json({ success: 1, name: client.userName, email: client.email,token });
  } catch (error) {
    console.log("error-", error);
    res.status(500).json({ success: 0, error });
  }
};
const logout = (req, res) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(400).json({ success: 0, msg: "No Token" });
    }
    res.clearCookie("token");
    console.log("hey");
    return res.status(200).json({ success: 1 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: -1, err });

  }
};
module.exports = { postUser, getUser, logout };
