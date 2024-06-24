const productRoutes = require("./product.route.js");
const homeRoutes = require("./home.route.js");
const searchRoutes = require("./search.route.js");
const categoryMiddleware = require("../../middlewares/client/category.middleware.js");
const cartMiddleware = require("../../middlewares/client/cart.milddleware.js");
const cartRoute = require("./cart.route.js");
const checkoutRoute = require("./checkout.route.js");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use(cartMiddleware.cart);

    app.use("/", homeRoutes);
    
    app.use("/products", productRoutes);

    app.use("/search", searchRoutes);
    
    app.use("/cart", cartRoute);

    app.use("/checkout", checkoutRoute);

}