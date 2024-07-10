const express = require("express");
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

const settingController = require("../../controllers/admin/setting.controller.js");

router.get("/general", settingController.general);

router.patch("/general",upload.single('logo'),uploadCloud.uploadSingle, settingController.generalPatch);

module.exports = router;