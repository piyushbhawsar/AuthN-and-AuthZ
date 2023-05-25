const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.signup = async(req,res) => {
    try{
        const { name,email,password,role }= req.body
        const alreadyExists = await User.findOne({email})
        if(alreadyExists){
            return res.status(400).json({
                success: false ,
                message: "User already Exists" ,
            })
        }
        let hashedPassword ;
        try{
            hashedPassword = await bcrypt.hash(password,10)
        }
        catch(e){
            return res.status(500).json({
                success: false,
                message: "Error in Hashing"
            })
        }
        console.log(`Hashed Password = ${hashedPassword}`)
        const user = await User.create({ name,email,password:hashedPassword,role })
        return res.status(200).json({
            success: true,
            message: "User Created",
            user: user
        })
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "User can't Be Registered re"
        })
    }
}

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(401).json({
          success: false,
          message: "Please Fill All The Details",
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User Not Registered, Please Signup first",
        });
      }
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) { // Password matched
        // Generate JWT and cookies
        let token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );
        // Add token to user object
        user.token = token;
        user.password = undefined;
        // Set cookie
        const option = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };
        res.cookie("bhawsarCookie", token, option).status(200).json({
          success: true,
          message: "User Logged In Successfully",
          user: user,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "Incorrect Password",
        });
      }
    } catch (e) {
      console.log("Login failed");
      return res.status(500).json({
        success: false,
        message: "Login Failed",
      });
    }
  };
  