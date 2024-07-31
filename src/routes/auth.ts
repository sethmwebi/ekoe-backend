import { Router } from 'express'
import * as AuthControllers from '../controllers/auth'
import passport from 'passport'

const authRouter = Router()

authRouter.post('/register', AuthControllers.register)
authRouter.post('/login', AuthControllers.login)
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)
authRouter.get('/auth/google/callback', AuthControllers.google)
authRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
)
authRouter.get('/auth/facebook/callback', AuthControllers.facebook)
authRouter.get(
  '/twitter',
  passport.authenticate('twitter'),
)
authRouter.get('/auth/twitter/callback', AuthControllers.twitter)

export default authRouter
