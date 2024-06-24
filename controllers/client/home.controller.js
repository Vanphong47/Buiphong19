const Product = require("../../models/product.model");

//[GET] /
module.exports.index = async (req, res) => {
    // sản phẩm nổi bật
    const productFeatured = await Product.find({
        featured: "1",
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    }).limit(6);
    for (const item of productFeatured) {
        item.priceNew = item.price * (1 - item.discountPercentage/100)
        item.priceNew = item.priceNew.toFixed(0);
    }
    // hết sản phẩm nổi bật
    // sản phẩm mới
    const productNew = await Product.find({
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    }).limit(6);
    for (const item of productNew) {
        item.priceNew = item.price * (1 - item.discountPercentage/100)
        item.priceNew = item.priceNew.toFixed(0);
    }
    // hết sản phẩm mới
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productFeatured: productFeatured,
        productNew: productNew
    }); 
}