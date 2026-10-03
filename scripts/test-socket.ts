import net from "node:net";

const host = "165.227.160.59";
const port = 28442;

const socket = net.createConnection(
    {
        host,
        port,
        timeout: 10000,
    },
    () => {
        console.log("TCP SOCKET CONNECTED");
        console.log(`Connected to ${host}:${port}`);

        socket.end();
    }
);

socket.on("timeout", () => {
    console.error("TCP SOCKET TIMEOUT");
    socket.destroy();
});

socket.on("error", (error) => {
    console.error("TCP SOCKET ERROR");
    console.error(error);
});

socket.on("close", () => {
    console.log("SOCKET CLOSED");
});