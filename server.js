// advance version of creating model
import http from "http";
import app from "./app/app.js";

//create server
const PORT = process.env.PORT || 2030;
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is Connected to ${PORT}`));
