const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterState.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree.helper");


//[GET] /admin/products/
module.exports.index = async (req, res) => {
    try {
        //  filterState 
        const filterState = filterStatusHelper(req.query);
        // end filterState 
        const find = {
            deleted: false,
        }
        if(req.query.status) {
            find.status = req.query.status;
        }
        // search
        if(req.query.keyword) {
            const regex = new RegExp(req.query.keyword, "i");
            find.title = regex;
        }
        // end search

        // pagination 
        const countProducts = await Product.countDocuments(find);
        const objectPagination = paginationHelper(4, req.query, countProducts);
        // end pagination
        // Sort
        const sort = {};
        if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
        } else {
        sort["position"] = "desc";
        }
        // End Sort
        const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);


        for (const product of products) {
            const account = await Account.findOne({
                _id: product.createdBy.accountId, 
            });
            if(account) {
                product.createdBy.fullName = account.fullName;
            }
        }

        console.log(products);
    
        res.render("admin/pages/products/index.pug", {
            pageTitle: "danh sach san pham", 
            products: products,
            filterState: filterState,
            keyword: req.query.keyword,
            pagination: objectPagination
      });
      
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }  
}
//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const objectUpdatedBy = {
        accountId: res.locals.user.id,
        updatedAt: new Date()
    }
    await Product.updateOne({
        _id: id
    }, {
        status: status,
        $push: { updatedBy: objectUpdatedBy }
    });
    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect("back");
}
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({
                _id: { $in: ids }
            }, {
                status: type
            });
            break;
        case "delete-all":
            await Product.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.user.id,
                    deletedAt: new Date()
                }
            });
            req.flash('success', 'Xóa sản phẩm thành công!');
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            req.flash('success', 'thay đổi vị trí thành công!');
            break;    
        default:
            break;
    }

    res.redirect("back");
}
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
    
        // await Product.deleteOne({
        //   _id: id
        // });
    
        await Product.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedBy: {
                accountId: res.locals.user.id,
                deletedAt: new Date()
            }
        });
        req.flash('success', 'Xóa sản phẩm thành công!');
      } catch (error) {
        console.log(error);
      }
    
    res.redirect("back");
}
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false
      });
    
    const newRecords = createTreeHelper(records);
    res.render("admin/pages/products/create", {
      pageTitle: "Thêm mới sản phẩm",
      records: newRecords
    });
};
  
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("products_create")){
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if(req.body.position == "") {
          const countProducts = await Product.countDocuments();
          req.body.position = countProducts + 1;
        } else {
          req.body.position = parseInt(req.body.position);
        }
        
        if(req.file && req.file.filename){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        req.body.createdBy = {
            accountId: res.locals.user.id,
            createdAt: new Date()
        }
        const product = new Product(req.body);
        await product.save();
      
        req.flash("success", "Thêm mới sản phẩm thành công!");
      
        res.redirect(`/${systemConfig.prefixAdmin}/products`);

    } else {
        res.send(false);
    }
};
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        const records = await ProductCategory.find({
            deleted: false
          });
        
        const newRecords = createTreeHelper(records);
        res.render("admin/pages/products/edit", {
        pageTitle: "chỉnh sửa sản phẩm",
        product: product,
        records: newRecords
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
};
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        req.body.position = parseInt(req.body.position);
        if(req.file && req.file.filename) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        const objectUpdatedBy = {
            accountId: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({
            _id: id,
            deleted: false
        },{
            ...req.body,
            $push: { updatedBy: objectUpdatedBy }
        });
        req.flash("success", "Chỉnh sửa sản phẩm thành công!");
        res.redirect("back");
    } catch (error) {
        res.send("Error");
    }
};
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });
        res.render("admin/pages/products/detail", {
        pageTitle: "chi tiết sản phẩm",
        product: product
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
};
    