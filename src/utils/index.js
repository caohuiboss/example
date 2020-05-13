export function uuid() {
    return Number(Math.random().toString().substr(3, 6) + Date.now()).toString(36)
}