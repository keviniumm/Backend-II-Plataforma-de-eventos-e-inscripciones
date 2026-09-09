import UsersDao from '../dao/users.dao.js'

class UsersRepository {
    constructor() {
        this.usersDao = new UsersDao()
    }

    async findByEmail(email) {
        return await this.usersDao.findByEmail(email)
    }

    async create(userData) {
        return await this.usersDao.create(userData)
    }
}

export default UsersRepository