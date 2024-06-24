const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree.helper");
module.exports.category = async (req, res, next) => {
    const categoryProduct = await ProductCategory.find({
        deleted: false
    });
    const newcategoryProduct = createTreeHelper(categoryProduct);
    res.locals.layoutCategoryProducts= newcategoryProduct;
    next();
}
