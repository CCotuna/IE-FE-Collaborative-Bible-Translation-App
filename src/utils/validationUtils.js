export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const isOwner = (userId, projectOwnerId) => {
    if (!userId || !projectOwnerId) {
        return false
    }
    return userId === projectOwnerId
}