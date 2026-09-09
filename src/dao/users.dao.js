import User from '../models/User.js'

class UsersDao {
    async findByEmail(email) {
        return await User.findOne({ email })
    }

    async create(userData) {
        return await User.create(userData)
    }
}

export default UsersDao