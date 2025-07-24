import io from "socket.io-client";

let socket = null;

export const createSocketConnection = () => {
    if (!socket) {
        if (location.hostname === "localhost") {
            socket = io(import.meta.env.VITE_BASE_URL);
        } else {
            socket = io("/", { path: "/api/socket.io" });
        }
    }
    return socket;
};

export const getSocketInstance = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};