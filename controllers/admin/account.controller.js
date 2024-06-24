const md5 = require('md5');
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const generateHelpers = require("../../helpers/generate.helper")
//[GET] /admin/account/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await Account.find(find);
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "danh sách tài khoản",
        records: records
    });
}
//[GET] /admin/account/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
    });
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    }); 
}
//[POST] /admin/account/create
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("account_create")){
        req.body.token = generateHelpers.generateRandomString(30);
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    } else {
        res.send(false);
    }
}
//[GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
    try {
      const data = await Account.findOne({
        _id: req.params.id,
        deleted: false
      });
      const roles = await Role.find({
        deleted: false
      });
      res.render("admin/pages/accounts/edit.pug", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        data: data,
        roles: roles
    });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
}
//[PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    if(req.body.password){
        req.body.password = md5(req.body.password);
    } else {
        delete req.body.password;
    }
    await Account.updateOne({
        _id: id,
        deleted: false,
    }, req.body);
    req.flash("success", "Cập nhật tài khoản thành công!");
    res.redirect("back"); 
}