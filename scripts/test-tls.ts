import tls from "node:tls";

const host = "mysql-27ba4600-crm-cca.f.aivencloud.com";
const port = 28442;

const socket = tls.connect(
    {
        host,
        port,
        rejectUnauthorized: false,
        servername: host,
        timeout: 10000,
    },
    () => {
        console.log("TLS CONNECTED");
        console.log("authorized:", socket.authorized);
        console.log("authorizationError:", socket.authorizationError);
        console.log("protocol:", socket.getProtocol());

        socket.end();
    }
);

socket.on("timeout", () => {
    console.error("TLS TIMEOUT");
    socket.destroy();
});

socket.on("error", (error) => {
    console.error("TLS ERROR");
    console.error(error);
});

socket.on("close", () => {
    console.log("TLS SOCKET CLOSED");
});