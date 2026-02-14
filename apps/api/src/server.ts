import { createServer } from "http";
import { app } from "./app.js";
import { env } from "./lib/env.js";
import { initSocket } from "./socket/index.js";

const server = createServer(app);
initSocket(server);

server.listen(env.port, () => {
  console.log(`API listening on :${env.port}`);
});
