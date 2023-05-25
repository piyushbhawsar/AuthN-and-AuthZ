require("dotenv").config()
const jwt = require("jsonwebtoken")

exports.auth = (req,res,next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "")
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Not Found"
            })
        }
        try{
            const decodePayload = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decodePayload)
            req.user = decodePayload //req .user mai payload bhej dia
        } catch(e){
            return res.status(401).json({
                success: false,
                message: "Token Not Verified"
            })
        }
        next()
    } catch(e){
        return res.status(401).json({
            success: false,
            message: "Something Went Wrong Please Verify Token"
        })
    }
}

exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== "Student") { //req.user mai payload aaya tha 
            return res.status(401).json({
                success: false,
                message: "This Protected Route Is For Student Only"
            })
        }
        next()
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "User Role Not Matching"
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This Protected Route Is For Admin Only"
            })
        }
        next()
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "User Role Not Matching"
        })
    }
}