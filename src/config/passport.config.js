import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'

import usersModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const { first_name, last_name, email } = req.body

    try {
      const user = await usersModel.findOne({ email: username }).lean().exec()
      if (user) {
        return done({ passportError: 'Usuario ya existente en la base de datos' }, false)
      }
      const newUser = await usersModel.create({
        first_name,
        last_name,
        email,
        password: createHash(password)
      })

      return done(null, newUser)
    } catch (error) {
      return done({ catchErrorPassport: 'Error al obtener usuario', error })
    }
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await usersModel.findOne({ email: username }).lean().exec()
      if (!user) {
        console.log('Contrasena incorrecta')
        return done(null, false)
      }
      if (!isValidPassword(user, password)) {
        console.log('Contraseña incorrecta')
        return done(null, false)
      }
      return done(null, false)
    } catch (error) {
      return done('PASSPORT_ERROR: ', error)
    }
  }))

  passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.c5812c7a05e1441f',
    clientSecret: '5cc536e603dde0109e1d741d33522f08985b7f76',
    callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback',
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
      const user = await usersModel.findOne({ email: profile.emails[0].value })
      if (user) return done(null, user)

      const newUser = await usersModel.create({
        first_name: profile._json.name,
        last_name: '',
        email: profile.email[0].value,
        password: ''
      })
      return done(null, newUser)
    } catch (error) {
      return done('Error to login with GitHub: ', error)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id).lean().exec()
    done(null, user)
  })
}

export default initializePassport
