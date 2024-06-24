const dashboardRoutes = require("./dashboard.route.js");
const productsRoutes = require("./product.route.js");
const productsCategoryRoutes = require("./product-category.route.js");
const roleRoutes = require("./role.route.js");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route.js");
const myAccountRoutes = require("./my-account.route.js");

const authmiddelware = require("../../middlewares/admin/auth.middleware.js");


const systemConfig = require("../../config/system.js");

module.exports = (app) => {
    const PATH_ADMIN =`/${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`,authmiddelware.requireAuth, dashboardRoutes);
    app.use(`${PATH_ADMIN}/products`,authmiddelware.requireAuth, productsRoutes);
    app.use(`${PATH_ADMIN}/products-category`,authmiddelware.requireAuth, productsCategoryRoutes);
    app.use(`${PATH_ADMIN}/roles`,authmiddelware.requireAuth, roleRoutes);
    app.use(`${PATH_ADMIN}/accounts`,authmiddelware.requireAuth, accountRoutes);
    app.use(`${PATH_ADMIN}/auth`, authRoutes);
    app.use(`${PATH_ADMIN}/my-account`,authmiddelware.requireAuth, myAccountRoutes);

}