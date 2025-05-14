const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
// register controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkUserExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkUserExists) {
      return res.status(400).json({
        success: false,
        message:
          "This username or email already exists, try with different data.",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();
    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User is created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Request failure. Unable to register now. Try after some time",
      data: error,
    });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkIfUserExist = await User.findOne({ username });
    if (!checkIfUserExist) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    const checkIfPasswordMatch = await bcrypt.compare(
      password,
      checkIfUserExist.password
    );
    if (!checkIfPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create user token
    const accessToken = jwt.sign(
      {
        userId: checkIfUserExist._id,
        username: checkIfUserExist.username,
        role: checkIfUserExist.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Login is successful",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Request failure. Unable to login now. Try after some time",
      data: error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { password, newPassword, confirmPassword } = req.body;
    const user = await User.findById(userId);
    const checkIfPasswordMatch = await bcrypt.compare(password, user.password);
    if (!checkIfPasswordMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Entered existing password does not match! Provide the correct existing password",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password does not match!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(
      userId,
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "Password is successfully changed!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Technical failure. Unable to change password. Try after some time",
      data: error,
    });
  }
};

const sendResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const checkIfUserExist = await User.findOne({ email });
    if (!checkIfUserExist) {
      return res.status(400).json({
        success: false,
        message: "This email does nto exist",
      });
    }
    const resetPasswordToken = jwt.sign(
      {
        email,
      },
      "13579",
      { expiresIn: "1m" }
    );
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch" <gregory.boyer@ethereal.email>',
      to: "sensoumya94@gmail.com",
      subject: "Hello ✔",
      text: `http://localhost:3000/api/auth/reset/${resetPasswordToken}`, // plain‑text body
      html: `<a href='http://localhost:3000/api/auth/reset/${resetPasswordToken}'>CLick to reset</a>`, // HTML body
    });

    res.status(201).json({
      success: true,
      message: "Message is sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Request failure. send mail",
      data: error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    if (!resetToken) {
      return res.status(401).json({
        success: false,
        message: "No token is sent to reset password",
      });
    }
    const decodedToken = jwt.verify(resetToken, "13579");
    res.status(200).json({
      success: true,
      message: "password reset successful",
      decodedToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Request failure. Try again",
      data: error,
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  changePassword,
  sendResetPassword,
  resetPassword,
};
