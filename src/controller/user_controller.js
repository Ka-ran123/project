const UserModel = require("../model/user_model");
const OtpModel = require("../model/otp_model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const genarateToken = require("../utils/genareteToken");

// const { genarateToken } = require("../utils/genareteToken");

const UserController = {
  createUser: async function (req, res) {
    try {
      const data = req.body;
      // console.log(data);
      const foundUser = await UserModel.findOne({ email: data.email });
      if (foundUser) {
        const response = { success: false, message: "Email is already exist" };
        return res.status(401).json(response);
      }
      const user = new UserModel(data);
      await user.save();

      // const userData = {
      //     name:user.name,
      //     email:user.email,
      //     mobileNo:user.mobileNo,
      //     id:user._id
      // }

      const userData = user.getData();

      // const userToken = await genarateToken(user._id);
      const userToken = await genarateToken.genarateToken(user._id);
      // console.log(userToken);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "projectfirst276@gmail.com",
          pass: "Project_First",
          clientId:
            "752805372678-t9jjv7gjdcp596do9nho1p77rtuoth4s.apps.googleusercontent.com",
          clientSecret: "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",
          refreshToken:
            "1//04ttjLLZCc7nCCgYIARAAGAQSNwF-L9Ir-vqbB5BQHi_P5exz_sHwPOGYGnJpnjZPYNHRiJyY8vOaYuYj1KB1XdjjYoNyM1bD2yw",
        },
      });

      //   const transporter = nodemailer.createTransport({
      //     host: 'smtp.ethereal.email',
      //     port: 587,
      //     auth: {
      //         user: 'everardo.hettinger@ethereal.email',
      //         pass: 'ysH4EGaGEZUycBFTfv'
      //     }
      // });

      const mailOptions = {
        from: "karanunagar123@gmail.com",
        to: userData.email,
        subject: "Sending Email using Node.js",
        // text: `Hii ! I am Karan Unagar.I am trying to learn send email using Node js.`,
        html: "<h1>Hello</h1>",
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email Sent : " + info.response);
        }
      });

      const response = {
        success: true,
        data: userData,
        message: "New User Created",
        token: userToken,
      };
      return res.json(response);
    } catch (e) {
      const response = { success: false, message: e.message };
      return res.status(400).json(response);
    }
  },
  signIn: async function (req, res) {
    try {
      (email = req.body.email), (password = req.body.password);

      const findUser = await UserModel.findOne({ email });
      if (!findUser) {
        const response = { success: false, message: "Email is not exist" };
        return res.status(401).json(response);
      }
      const matchPass = await bcrypt.compare(password, findUser.password);
      if (!matchPass) {
        const response = { success: false, message: "Password is wrong" };
        return res.status(401).json(response);
      }

      const userData = findUser.getData();
      const userToken = await genarateToken.genarateToken(findUser._id);

      const response = {
        success: true,
        data: userData,
        message: "Sign in successfully",
        token: userToken,
      };
      return res.json(response);
    } catch (e) {
      const response = { success: false, message: e.message };
      return res.status(400).json(response);
    }
  },
  changePassword: async function (req, res) {
    try {
      _id = req.body._id;
      password = req.body.password;
      newPassword = req.body.newPassword;

      const findUser = await UserModel.findById({ _id });
      //  console.log(findUser);

      const matchPass = await bcrypt.compare(password, findUser.password);
      if (!matchPass) {
        const response = { success: false, message: "Password is wrong" };
        return res.status(401).json(response);
      }

      findUser.password = newPassword;
      await findUser.save();
      const response = { success: true, message: "Password is change" };
      return res.json(response);
    } catch (e) {
      const response = { success: false, message: e.message };
      return res.status(400).json(response);
    }
  },

  forgetPassword: async function (req, res) {
    try {
      email = req.body.email;
      // console.log(email);
      const foundUser = await UserModel.findOne({ email: email });
      if (!foundUser) {
        const response = { success: false, message: "Email is already exist" };
        return res.status(401).json(response);
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "projectfirst276@gmail.com",
          // pass: "Project_First",
          clientId:
            "752805372678-t9jjv7gjdcp596do9nho1p77rtuoth4s.apps.googleusercontent.com",
          clientSecret: "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",
          refreshToken:
            "1//04ttjLLZCc7nCCgYIARAAGAQSNwF-L9Ir-vqbB5BQHi_P5exz_sHwPOGYGnJpnjZPYNHRiJyY8vOaYuYj1KB1XdjjYoNyM1bD2yw",
        },
      });

      function generateOTP() {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }

      const otp = generateOTP();
      
      const mailOptions = {
        from: "projectfirst276@gmail.com",
        to: foundUser.email,
        subject: "Sending Email using Node.js",
        html: `Your OTP IS :- ${otp}`,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          const response = { success: false };
          return res.status(400).json(response);
        } else {
          console.log("Email Sent : " + info.response);
          const user = new OtpModel({ email: foundUser.email, otp: otp });
          await user.save();
          const response = { success: true, message: "Otp Send" };
          return res.json(response);
        }
      });
    } catch (e) {
      const response = { success: false, message: e.message };
      return res.status(400).json(response);
    }
  },
};

module.exports = UserController;
