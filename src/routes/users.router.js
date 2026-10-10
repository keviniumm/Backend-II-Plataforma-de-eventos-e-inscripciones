import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js'
import { getUsers } from '../controllers/users.controller.js'

const router = Router()

router.get(
    '/',
    authMiddleware,
    authorizeMiddleware('admin'),
    getUsers
)

export default router