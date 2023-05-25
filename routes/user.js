const express = require("express")
const { signup, login } = require("../controllers/auth")
const { auth, isStudent, isAdmin } = require("../middlewares/Auth")
const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)

router.get("/test",auth, (req,res) => {
    return res.status(401).json({
        success: true,
        message: "Welcome To Test Protected Route"
    })
})
router.get("/student", auth,isStudent, (req,res) => {
    return res.status(401).json({
        success: true,
        message: "Welcome To Protected Route For Students"
    })
})
router.get("/admin",auth,isAdmin, (req,res) => {
    return res.status(401).json({
        success: true,
        message: "Welcome To Protected Route For Admins"
    })
})
module.exports = router