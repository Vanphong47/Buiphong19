const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree.helper");
//[GET] /admin/products-category/
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });
    res.render("admin/pages/products-category/index.pug", {
      pageTitle: "Danh mục sản phẩm",
      records: records 
  });
};
// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
      const id = req.params.id;
     
      await ProductCategory.updateOne({
          _id: id
      }, {
          deleted: true,
          deletedAt: new Date()
      });
      req.flash('success', 'Xóa danh mục sản phẩm thành công!');
    } catch (error) {
      console.log(error);
    }
  
  res.redirect("back");
}
//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  const records = await ProductCategory.find({
    deleted: false
  });

  const newRecords = createTreeHelper(records);

  console.log(newRecords);
  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Thêm mới danh mục sản phẩm",
    records: newRecords 
});
};
//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if(res.locals.role.permissions.includes("products-category_create")){
    if(req.body.position == "") {
      const countRecords = await ProductCategory.countDocuments();
      req.body.position = countRecords + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    
    const records = new ProductCategory(req.body);
    await records.save(); // dòng code để update
    req.flash("success", "Thêm mới danh mục sản phẩm thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  }else {
    res.send(false);
  }
}
//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const data = await ProductCategory.findOne({
      _id: req.params.id,
      deleted: false
    });
    const records = await ProductCategory.find({
      deleted: false
    });
  
    const newRecords = createTreeHelper(records);
    // console.log(data);
    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords
  });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
  }
  
};
//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if(req.body.position == "") {
      const countRecords = await ProductCategory.countDocuments();
      req.body.position = countRecords + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    
    await ProductCategory.updateOne({
      _id: req.params.id,
      deleted: false
    },req.body);
    req.flash("success", "Cập nhật danh mục sản phẩm thành công!");
    // res.redirect(`/${systemConfig.prefixAdmin}/products-category`); // về trang hiện tại
    res.redirect(`back`); //  về trang danh sách sản phẩm 
  } catch (error) {
    res.send("Error");
  }
}