import UsersDao from '../dao/users.dao.js'

class UsersRepository {
    constructor() {
        this.usersDao = new UsersDao()
    }

    async findByEmail(email) {
        return await this.usersDao.findByEmail(email)
    }

    async findAll() {
        return await this.usersDao.findAll()
    }

    async create(userData) {
        return await this.usersDao.create(userData)
    }
}

export default UsersRepository