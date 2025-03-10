export function isAuthenticated() {
    return !!localStorage.getItem('username')
}
