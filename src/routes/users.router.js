import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authorizeMiddleware } from '../middlewares/authorize.middleware.js'
import UsersRepository from '../repositories/users.repository.js'

const router = Router()
const usersRepository = new UsersRepository()

router.get(
    '/',
    authMiddleware,
    authorizeMiddleware('admin'),
    async (req, res, next) => {
        try {
            const users = await usersRepository.findAll()

            res.status(200).json({
                status: 'success',
                payload: users
            })
        } catch (error) {
            next(error)
        }
    }
)

export default router