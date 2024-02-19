const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

const authRouter = require("./auth");
const productRouter = require("./product");

router.use("/auth", authRouter);

/******* below are all the routes that WILL NOT pass through the middleware ********/

router.use(async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token.split(" ")[1], "MY_SECRET")
        req.user = user;
        next()
    } catch (e) {
        return res.json({ msg: "TOKEN NOT FOUND / INVALID" })
    }
})

/******* below are all the routes that WILL pass through the middleware ********/

router.use("/product", productRouter);

module.exports = router;