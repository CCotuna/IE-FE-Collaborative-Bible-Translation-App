export function isAuthenticated() {
    return !!localStorage.getItem('email')
}
