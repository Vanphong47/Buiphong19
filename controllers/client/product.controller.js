const Product = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");
// [GET] /products/
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({
        position: "desc"
    });
        
    for (const item of products) {
        item.priceNew = item.price * (1 - item.discountPercentage/100)
        item.priceNew = item.priceNew.toFixed(0);
    }

    // console.log(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: products
    }); 
}
// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const slugCategory = req.params.slugCategory;
        const category = await productCategory.findOne({
          slug: slugCategory,
          deleted: false,
          status: "active"
        });
        const getSubCategory = async (parentId) => {
          const subs = await productCategory.find({
            parent_id: parentId,
            deleted: false,
            status: "active"
          });
          let allSubs = [...subs];
          for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSubs = allSubs.concat(childs);
          }
          return allSubs;
        }
        const allCategory = await getSubCategory(category.id);
        const allCategoryId = allCategory.map(item => item.id);
        const products = await Product.find({
          product_category_id: {
            $in: [
              category.id,
              ...allCategoryId
            ]
          },
          deleted: false,
          status: "active"
        }).sort({
          position: "desc"
        });
        for (const item of products) {
          item.priceNew = item.price * (1 - item.discountPercentage/100);
          item.priceNew = item.priceNew.toFixed(0);
        }
        res.render("client/pages/products/index", {
          pageTitle: "Danh sách sản phẩm",
          products: products
        });

    
      } catch (error) {
        res.redirect("/");
      }
};
// [GET] /detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slugProduct;
    
        const product = await Product.findOne({
          slug: slug,
          deleted: false,
          status: "active"
        });
        product.priceNew = product.price * (1 - product.discountPercentage/100)
        product.priceNew = product.priceNew.toFixed(0);
        if(product.product_category_id){
          const category = await productCategory.findOne({
            _id: product.product_category_id,
          });
          product.category = category;
        }
        res.render("client/pages/products/detail", {
          pageTitle: product.title,
          product: product
        });
      } catch (error) {
        res.redirect("/");
      }
};






















// //[GET] /products/detail
// module.exports.detail = (req, res) => {
//     res.send("trang chinh sua san pham");  
// }
// //[GET] /products/edit
// module.exports.edit = (req, res) => {
      
// }
// //[GET] /products/create
// module.exports.create = (req, res) => {
      
// }