const Users = require("../models/userModel");

const authAdmin = async (req, resp, next) => {
  try {
    const user = await Users.findOne({
      _id: req.user.id,
    });
    if (user.role === 0) {
      return resp.status(400).json({ msg: "Admin Resources Access Denied" });
    }
    next();
  } catch (err) {
    return resp.status(500).json({ msg: err.message });
  }
};

module.exports = authAdmin;
