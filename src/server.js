const express = require("express")
const app = express()
const handlebars = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const SwaggerUiExpress = require("swagger-ui-express")
const upload = require("./multer/multerConfig.js")

// Importar Controladores para Socket
const ProductController = require("./controllers/productController.js");
const productController = new ProductController();

// Importando funcion de conexion de la db
const connectDB = require("./config/db.js")

// Cargar variables de entorno
require('dotenv').config();

// Importando Rutas
const userRoutes = require('./routes/user.router.js');
// const authRoutes = require('./routes/auth.router.js')
const productRoutes = require("./routes/product.router.js")
const cartRouter = require("./routes/cart.router.js")
const vistasRouter = require("./routes/vistas.Router.js")
const mailRouter = require("./routes/mail.router.js")
const loggerRouter = require("./routes/logger.router.js")

// Passport
const passport = require("passport")
const initializaPassport = require("./config/passport.config");
const loggerMiddleware = require("./loggerMiddleware.js");

// Configuracion handlebars
app.engine("handlebars", handlebars.engine());
//Carpeta de la vista
app.set("views", __dirname + "/views");
//Establecer handlebars como motor de plantilla
app.set("view engine", "handlebars");
//Archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ejecutando funcion de conexion a la Base de datos
connectDB();

const PORT = process.env.PORT

const swaggerOptions = {
  definition:{
    openapi: '3.0.1',
    info:{
      title:'Documentacion API RESTful ecommerce',
      description: "Api clase swagger"
    }
  },
  apis: ['./src/docs/**/*.yaml']
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(upload.any())

// Inicializar el middleware de autenticacion
initializaPassport()
app.use(passport.initialize())

app.use(loggerMiddleware)

app.use("/users", userRoutes)
app.use("/products", productRoutes)
app.use("/cart", cartRouter)
app.use("/", vistasRouter)
app.use("/", mailRouter)
app.use("/", loggerRouter)



const server = app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

module.exports = server;