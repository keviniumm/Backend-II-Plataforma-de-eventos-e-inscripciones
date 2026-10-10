import { getUsersService } from '../services/users.service.js'
import { toRegisteredUserDTO } from '../dto/user.dto.js'

export const getUsers = async (req, res, next) => {
    try {
        const users = await getUsersService()

        res.status(200).json({
            status: 'success',
            payload: users.map(toRegisteredUserDTO)
        })
    } catch (error) {
        next(error)
    }
}