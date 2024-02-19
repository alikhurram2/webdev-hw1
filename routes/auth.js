const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken")

router.post("/signUp", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
  
      // Basic validation checks
      if (!email || !password || !firstName || !lastName) {
        return res.json({ msg: "Please fill in all required fields." });
      }
  
      if (password.length < 8) {
        return res.json({ msg: "Password must be at least 8 characters long." });
      }
  
      if (firstName.length < 3 || lastName.length < 3) {
        return res.json({ msg: "Name must be at least 3 characters long." });
      }
  
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.json({ msg: "Invalid email format." });
      }
  
      // Check for existing user
      let user = await Users.findOne({ email });
      if (user) return res.json({ msg: "USER EXISTS" });
  
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 5);
      await Users.create({ ...req.body, password: hashedPassword });
  
      return res.json({ msg: "CREATED" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  });
  
  

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email })
        if (!user) return res.json({ msg: "USER NOT FOUND" })

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) return res.json({ msg: "WRONG PASSWORD" })

        const token = jwt.sign({
            email,
            createdAt: new Date(),
            admin: user.admin,
        }, "MY_SECRET", { expiresIn: "1d" });

        res.json({
            msg: "LOGGED IN", token
        })
    } catch (error) {
        console.error(error)
    }
});

module.exports = router
