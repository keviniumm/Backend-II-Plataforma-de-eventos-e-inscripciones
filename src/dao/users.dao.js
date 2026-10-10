import User from '../models/User.js'

class UsersDao {
    async findByEmail(email) {
        return await User.findOne({ email })
    }

    async findById(id) {
        return await User.findById(id)
    }

    async findAll() {
        return await User.find().select('-password')
    }

    async create(userData) {
        return await User.create(userData)
    }
}

export default UsersDao