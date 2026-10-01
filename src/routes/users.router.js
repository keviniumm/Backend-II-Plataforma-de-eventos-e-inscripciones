import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js'

const router = Router()

router.get(
    '/',
    authMiddleware,
    authorizeMiddleware('admin'),
    (req, res) => {
        res.status(200).json({
            status: 'success',
            payload: []
        })
    }
)

export default router