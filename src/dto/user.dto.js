export const toAuthenticatedUserDTO = (user) => {
    return {
        id: user.id || user._id.toString(),
        email: user.email,
        role: user.role
    }
}

export const toRegisteredUserDTO = (user) => {
    return {
        id: user.id || user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
    }
}