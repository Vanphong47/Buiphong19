const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;
    let products = [];
    if(keyword) {
        const keywordRegex = new RegExp(keyword, "i");
        products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        }).sort({position: "desc"});
    }
    res.render("client/pages/search/index.pug", {
        pageTitle: "Trang chủ",
        keyword: keyword,
        products: products
    }); 
}