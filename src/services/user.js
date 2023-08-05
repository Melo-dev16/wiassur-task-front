export function setUser(data) {
    sessionStorage.setItem('user', JSON.stringify(data))
}

export function removeUser() {
    sessionStorage.removeItem('user')
}

export function getUser() {
    let data = sessionStorage.getItem('user')
    return data !== null ? JSON.parse(data) : data
}

export function setPersistUser(data) {
    localStorage.setItem('user', JSON.stringify(data))
}

export function removePersistUser() {
    localStorage.removeItem('user')
}

export function getPersistUser() {
    let data = localStorage.getItem('user')
    return data !== null ? JSON.parse(data) : data
}