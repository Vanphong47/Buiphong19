const express = require("express");
const router = express.Router();
const multer  = require('multer');

const upload = multer();
const productsCategoryController = require("../../controllers/admin/product-category.controller.js");
const validate = require("../../validates/admin/product-category.validate.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");


router.get("/", productsCategoryController.index);
router.delete("/delete/:id", productsCategoryController.deleteItem);
router.get("/create", productsCategoryController.create);
router.post("/create", upload.single('thumbnail'),uploadCloud.uploadSingle, validate.createPost, productsCategoryController.createPost);
router.get("/edit/:id", productsCategoryController.edit);
router.patch("/edit/:id", upload.single('thumbnail'),uploadCloud.uploadSingle, validate.createPost, productsCategoryController.editPatch);

module.exports = router;