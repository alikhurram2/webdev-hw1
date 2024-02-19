const Products = require("../models/Product");
const Users = require("../models/User"); // Assuming User model exists if needed
var express = require("express");
var router = express.Router();

router.post("/getByProductId", async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.body.productId }); // Assuming product ID is stored as _id
    if (!product) return res.json({ msg: "PRODUCT NOT FOUND" });
    res.json({ msg: "PRODUCT FOUND", data: product });
  } catch (error) {
    console.error(error);
  }
});

// Additional route example (populate user if applicable)
router.post("/getByProductIdWithUser", async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.body.productId }).populate("user"); // Assuming user field exists
    if (!product) return res.json({ msg: "PRODUCT NOT FOUND" });
    res.json({ msg: "PRODUCT FOUND", data: product });
  } catch (error) {
    console.error(error);
  }
});

/******* below are all the routes that WILL NOT pass through the middleware ********/

router.use((req, res, next) => {
  if (!req.user.admin) return res.json({ msg: "NOT ADMIN" });
  else next();
});

/******* below are all the routes that WILL pass through the middleware ********/

router.post("/addProduct", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email }); // Assuming user email is used for association
    if (!user) return res.json({ msg: "USER NOT FOUND" });
    await Products.create({ ...req.body, user: user._id }); // Assuming user association
    res.json({ msg: "PRODUCT ADDED" });
  } catch (error) {
    console.error(error);
  }
});

router.post("/deleteByProductId", async (req, res) => {
  try {
    const product = await Products.findOne({ productID: req.body.productID });
    if (!product) return res.json({ msg: "PRODUCT NOT FOUND" });
    await Products.deleteOne({ _id: req.body.productId });
    res.json({ msg: "PRODUCT DELETED" });
  } catch (error) {
    console.error(error);
  }
});

// New route for updating product
router.post("/updateProduct", async (req, res) => {
    try {
      const { productID, ...updateData } = req.body; // Destructure product ID and other update data
  
      const product = await Products.findOneAndUpdate({ productID }, updateData, { new: true }); // Update product and return updated document
  
      if (!product) return res.json({ msg: "PRODUCT NOT FOUND" });
  
      res.json({ msg: "PRODUCT UPDATED", data: product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });
  

module.exports = router;
