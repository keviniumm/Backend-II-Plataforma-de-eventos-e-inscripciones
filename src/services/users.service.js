import UsersRepository from '../repositories/users.repository.js'

const usersRepository = new UsersRepository()

export const getUsersService = async () => {
    return await usersRepository.findAll()
}