import express from "express";
import config from "./config.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import dirname from "./utils.js";
import { join } from "node:path";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import ProductManager from "./manager/ProductManager.js";

const manager = new ProductManager(
  join(dirname, "/fileManagement", "products.json")
);

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(dirname, "public")));

// handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", join(dirname, "/views"));

// routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

server.listen(config.PORT, () => {
  console.log(`Server listening on: http://localhost:${config.PORT}/`);
});

const io = new Server(server);
io.on("connection", (socketServer) => {
  console.log(`New client connected: ${socketServer.id}`);
  socketServer.on("idUpdate", async (id) => {
    const idFound = await manager.getID(id);
    socketServer.emit("loadlist", idFound);
  });

  socketServer.on("updatelist", async (update) => {
    const id = update.idProductForm;
    delete update.idProductForm;

    await manager.updateProduct(id, update);
  });

  socketServer.on("idDelete", async (id) => {
    const deleteProduct = await manager.deleteProduct(id);
    socketServer.emit("loadlist", deleteProduct);
  });

  socketServer.on("createlist", async (data) => {
    await manager.addProduct(data);
  });
});
