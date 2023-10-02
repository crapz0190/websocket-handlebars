import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";
import dirname from "../utils.js";
import { join } from "node:path";

const manager = new ProductManager(
  join(dirname, "/fileManagement", "products.json")
);
const router = Router();

router.get("/home", async (req, res) => {
  try {
    const getProducts = await manager.readProducts();
    res.render("home", {
      title: "Express Avanzado | Handlebars",
      products: getProducts,
    });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const getProducts = await manager.readProducts();
    res.render("realtimeproducts", {
      title: "Express Avanzado | Handlebars",
      products: getProducts,
    });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

export default router;
