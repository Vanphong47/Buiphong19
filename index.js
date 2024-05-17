const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const database = require("./config/database.js")
const systemConfig = require("./config/system");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();

database.connect();

// const mongoose = require("mongoose");
const routesAdmin = require("./routes/admin/index.route.js");
const routesClient = require("./routes/client/index.route.js");


const app = express();
const port = process.env.PORT;
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true 
  }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));


app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));
// flash 
app.use(cookieParser('buiphong19'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash 

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// routes admin
routesAdmin(app);

// routes client
routesClient(app);


app.listen(port, () => {
    
    console.log("app listening on port " + port);
});

