export function hourAndMinute() {
    return new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

export function date() {
    return new Date().toLocaleDateString("en-GB");
}
