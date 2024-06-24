const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/client/cart.controller.js");

router.get("/", cartController.index);

router.get("/delete/:productId", cartController.delete);

router.post("/add/:productId", cartController.addPost);

router.get("/update/:productId/:quantity", cartController.update);

module.exports = router;