const passport = require("passport")
const local = require("passport-local")
const utils = require("../utils")
// const UserManager = require("../Dao/userManager")
// const CartManager = require("../Dao/cartManagerMDB")
// const git = require("passport-github2")
const jwt = require("passport-jwt")
// const config = require("./config.js")
const userService = require("../services/userService")
const userModel = require("../models/user.model.js")
const {DateTime} = require("luxon")

const JwtStrategy = jwt.Strategy
const ExtractJwt = jwt.ExtractJwt

const cookieExtractor = req =>{
  let token = null
  if(req && req.cookies){
    token = req.cookies["token"]
  }
  return token
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey : process.env.SECRET_OR_KEY,
}

// const userManager = new UserManager();
// const cartManager = new CartManager()

const LocalStrategy = local.Strategy;
// const GitHubStrategy = git.Strategy;
const initializaPassport = () => {
    passport.use("login", new LocalStrategy({
      usernameField: "email"
    }, async (username, password, done) => {
      try {
        const user = await userService.getUserByEmail(username);
        if (!user) {
          return done(null, false, { message: 'Usuario no existe' });
        }
    
        if (!utils.isValidPassword(user, password)) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }
        // user.updateLastConnection()
        const fechaHoraLocal = DateTime.now();
        user.last_connection = fechaHoraLocal;
        await user.save();
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));

  //   passport.use("github", new GitHubStrategy({
  //     clientID: config.clientId,
  //     clientSecret: config.clientSecret,
  //     callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  //   }, async(accessToken, refreshToken, profile, done) => {
  //     try {
  //       console.log(profile);
  //       let user = await userManager.findEmailUser({email:profile._json.email})
  //       if(!user){
  //         let newUser = {
  //           first_name: profile._json.name,
  //           last_name: "",
  //           email: profile._json.email,
  //           age: 18,
  //           password: "",
  //           rol: "admin"
  //       }
  //       let result = await userManager.createUser(newUser)
  //       done(null, result)
  //     } else {
  //       done(null, user);
  //     }
  //     } catch (error) {
  //       return done(error)
  //     }
  //   }))

    // JWT
  passport.use('jwt', new JwtStrategy({
      jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.SECRET_OR_KEY
  }, async(jwt_payload, done)=>{
      try{
          return done(null, jwt_payload)
      }
      catch(err){
          return done(err)
      }
  }
  ))

  // passport.use("current", new JwtStrategy({
  //   jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  //   secretOrKey: process.env.SECRET_OR_KEY,
  // }, async (payload, done) => {
    
  //   try {
  //     /* console.log('Current JWT Strategy - Payload:', payload); */
  //     const user = await userService.getUserByEmail(payload.user.email);
  //     if (!user) {
  //       return done(null, false);
  //     }
  //     // Verificar si el usuario recuperado coincide con la estructura esperada en el DTO
  //     /* const userDTO = new UserDTO(user); */ // Crear un DTO a partir del usuario
  //     const userDTO = {
  //       email: user.email, // Asegúrate de incluir el email u otra información necesaria
  //       nombre: user.nombre, // Agrega el campo 'nombre' al objeto userDTO
  //       apellido: user.apellido,
  //       carrito: user.cart,
  //       rol: user.rol,
  //     };
  //     /* console.log("por aqui pasa", userDTO); */
  //     /* console.log("token de passport", token)  */
  //     return done(null, userDTO); // Pasar el DTO al done
  //   } catch (err) {
  //     return done(err, false);
  //   }
  // }));

}

module.exports = initializaPassport