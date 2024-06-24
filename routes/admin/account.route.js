const express = require("express");
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");


const accountsController = require("../../controllers/admin/account.controller.js");

router.get("/", accountsController.index);

router.get("/create", accountsController.create);

router.post("/create",upload.single("avatar"),uploadCloud.uploadSingle, accountsController.createPost);

router.get("/edit/:id", accountsController.edit);

router.patch("/edit/:id", upload.single("avatar"), uploadCloud.uploadSingle, accountsController.editPatch);
module.exports = router;