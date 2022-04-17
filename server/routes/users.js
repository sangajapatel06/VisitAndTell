import express from 'express'
// import certain controllers
import { signin, signup } from '../controllers/user.js'
//create an instance of a router
const router = express.Router()

router.post('/signin',signin)
router.post('/signup', signup)

export default router
