const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/admin/role.controller.js");

const validate = require("../../validates/admin/role.validate.js");


router.get("/", roleController.index);

router.get("/create", roleController.create);

router.post("/create",validate.createPost, roleController.createPost);

router.get("/edit/:id",roleController.edit);

router.patch("/edit/:id",validate.createPost ,roleController.editPatch);

router.get("/permissions", roleController.permissions);

router.patch("/permissions", roleController.permissionsPatch);


module.exports = router;