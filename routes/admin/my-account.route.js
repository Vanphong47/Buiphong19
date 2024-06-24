const express = require("express");
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");
const myAccountController = require("../../controllers/admin/my-account.controller.js");

router.get("/", myAccountController.index);
router.get("/edit", myAccountController.edit);
router.patch("/edit",upload.single('avatar'),uploadCloud.uploadSingle, myAccountController.editPatch);
module.exports = router;