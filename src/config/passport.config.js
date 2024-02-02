const passport = require("passport")
const local = require("passport-local")
const utils = require("../utils")
const git = require("passport-github2")
const jwt = require("passport-jwt")
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

const LocalStrategy = local.Strategy;
const GitHubStrategy = git.Strategy;
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

    passport.use("github", new GitHubStrategy({
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.callbackURL
    }, async(accessToken, refreshToken, profile, done) => {
      try {
        let user = await userService.getUserByEmail(profile._json.email)
        if(!user){
          console.log("Entre aqui");
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            age: "",
            password: "",
            rol: "admin"
          }
          user = await userService.createUser(newUser)
        }
        const token = utils.generateToken(user)
        done(null, token)
      } catch (error) {
        return done(error)
      }
    }))

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

}

module.exports = initializaPassport