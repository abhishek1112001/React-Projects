const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookies");

const userCtrl = {
  register: async (req, resp) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        return resp.status(400).json({ msg: "Email Already Registerd" });
      }

      if (password.length < 6) {
        return resp
          .status(400)
          .json({ msg: "Password is at least 6 characters" });
      }

      //Password Encryption

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: passwordHash,
      });

      //Save mongoDB
      await newUser.save();

      //Create JWT to authenticate
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      resp.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      resp.json({ accesstoken });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  refreshtoken: async (req, resp) => {
    try {
      const rf_token = req.cookies.refreshtoken; //it should be cookies and not cookie

      if (!rf_token) {
        return resp.status(400).json({ msg: "Please Login or Register" });
      }
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return resp.status(400).json({ msg: "Please Login or register" });
        }
        const accesstoken = createAccessToken({ id: user.id });
        resp.json({ user, accesstoken });
      });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  login: async (req, resp) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return resp.status(400).json({ msg: "User does not exist" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return resp.status(400).json({ msg: "Incorrect Password" });
      }

      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      resp.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      resp.json({ accesstoken });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, resp) => {
    try {
      resp.clearCookie("refreshtoken", {
        path: "/user/refresh_token",
      });
      return resp.json({ msg: "Log Out" });
    } catch (err) {
      console.log({ msg: err.message });
    }
  },
  getUser: async (req, resp) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // to remove the password from user information
      if (!user) {
        return resp.status(400).json({ msg: "User not found" });
      }
      resp.json(user);
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
