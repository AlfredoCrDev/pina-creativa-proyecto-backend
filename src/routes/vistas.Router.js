const express = require('express');
const router = express.Router();
const utils = require("../utils");
const ProductRepository = require("../repositories/productRepository");
const productRepository = new ProductRepository();
const UserRepository = require("../repositories/userRepository");
const userRepository = new UserRepository();
const cartService = require("../services/cartService");


// VISTAS
router.get("/register", async(req, res) => {
  try {
    
    res.render("register", { title: "Registro de Usuario" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})

const allowedRoles = ["premium", "admin"];
router.get("/profile", utils.passportCall("jwt"), utils.authorization(allowedRoles), async(req, res) => {
  try {
    const user = req.user.user;
    if(!user){
      console.log("No esta autorizado");
      return res.redirect("/")
    }
      const sessionData = {
        email: user.email,
        nombre: user.first_name,
        apellido: user.last_name,
        age: user.age || "No especifica",
        rol: user.rol,
      }
      res.render("profile", { title: "Perfil de Usuario", sessionData });
  } catch (error) {
    console.log("Error al tratar de mostrar el perfil de usuario", error);
  }
})

const buyerRole = ["usuario", "premium"]
router.get("/products", utils.passportCall("jwt"), utils.authorization(buyerRole), async(req, res) => {
  try {
    const user = req.user.user;
    if(!user){
      console.log("No esta autorizado");
      return res.redirect("/")
    }
    const { limit = 10 , page = 1 } = req.query;
    // const limit = 10
    // const page = 1
    const products = await productRepository.getAllProducts(limit, page)
    const cartId = user.cart
    res.render("productos", { 
      title: "Lista de productos",
      products: products,
      email : user.email,
      rol: user.rol,
      cart: cartId,
      userId: user._id
    })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
  }
})

router.get("/email", utils.passportCall("jwt"), utils.isUser, async(req, res) => {
  try {
    
    res.render("sendEmail", { title: "Envio de Correo" })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})

router.get("/createProducts", utils.passportCall("jwt"), utils.authorization(allowedRoles), async(req, res) => {
  try {
    const user = req.user.user
    const productos = await productRepository.getAllProducts({limit:100})
    res.render("realTimeProducts", { title: "Registro de Productos", productos, user })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})


router.get("/carrito/:cid", utils.passportCall("jwt"), utils.authorization(buyerRole), async (req, res) => {
  const cartId = req.params.cid;
  try {
    const productsInTheCart = await cartService.getCartById(cartId)
    
    res.render("cartView", { productsInTheCart })
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).send({ message: "Error al obtener el carrito" });
  }
});

router.get("/forgot-password", async (req, res) => {
  try {
    res.render("forgotPassword", { title: "Recuperar Contraseña" })
  } catch (error) {
    req.logger.error("Error al reder la pagina", error);
    res.status(500).send({ message: "Error interno del servidor" });
  }
});

router.get("/reset-password", async (req, res) => {
  const token = req.query.token;
  const email = req.query.email;
  try {
    res.render("resetPassword", { title: "Restablecer Contraseña", token, email })
  } catch (error) {
    req.logger.error("Error en el reset de la contraseña", error);
    res.status(500).send({ message: "Error restablecer la contraseña" });
  }
});

// router.post("/upload", upload.single("archivo"), (req, res) => {
//   res.json({ message: "Archivo subido exitosamente" });
// });

router.get("/upload/:uid", async (req, res) => {
  const userId = req.params.uid
  res.render("fileUpload", { title: "Subir archivo", userId });
});

router.get("/adminuser", utils.passportCall("jwt"), utils.isAdmin, async(req, res) => {
  try {
    const user = req.user.user
    const users = await userRepository.getAllUsers()
    res.render("realTimeUsers", { title: "Administracion de Usuarios", users, user })
  } catch (error) {
    console.log("Error al tratar de mostrar los productos", error);
    res.status(500).send("Error interno del servidor");
  }
})

module.exports = router;