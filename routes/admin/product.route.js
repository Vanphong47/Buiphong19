const express = require("express");
const router = express.Router();
const multer  = require('multer');
const storageMulter = require("../../helpers/storage-multer.helper");
const upload = multer({ storage: storageMulter() });
const productsController = require("../../controllers/admin/product.controller.js");
const validate = require("../../validates/admin/product.validate.js");

router.get("/", productsController.index);
router.patch("/change-status/:status/:id", productsController.changeStatus);
router.patch("/change-multi", productsController.changeMulti);
router.delete("/delete/:id", productsController.deleteItem);

router.get("/create", productsController.create);
router.post("/create", upload.single('thumbnail'),validate.createPost, productsController.createPost);
router.get("/edit/:id", productsController.edit);
router.patch("/edit/:id", upload.single('thumbnail'),validate.createPost, productsController.editPatch);
router.get("/detail/:id", productsController.detail);

module.exports = router;