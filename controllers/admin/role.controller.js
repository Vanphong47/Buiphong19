const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

//[GET] /admin/roles/
module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records
    }); 
}
//[GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Thêm mới nhóm quyền"
    }); 
}
//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("roles_create")){
        const record = new Role(req.body);
        await record.save();
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }else {
        res.send(false);
    }
}
//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const records = await Role.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            records: records
        }); 
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}
//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({
            _id: req.params.id,
            deleted: false
        }, req.body);
        req.flash("success", "Chỉnh sửa nhóm quyền thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/roles/permissions.pug", {
        pageTitle: "Phân quyền",
        records: records
    }); 
}
//[PATCJ] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const roles = JSON.parse(req.body.roles);
    try {
        for(const item of roles) {
            await Role.updateOne({
                _id: item.id,
            }, {
                permissions: item.permissions,
            });
        }
        req.flash("success", "Cập nhật phân quyền thành công");
    } catch (error) {
        req.flash("success", "Cập nhật phân quyền không thành công");
    }
    res.redirect("back");
}