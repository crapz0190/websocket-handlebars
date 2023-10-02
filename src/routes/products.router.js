import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";
import dirname from "../utils.js";
import { join } from "node:path";

const manager = new ProductManager(
  join(dirname, "/fileManagement", "products.json")
);
const router = Router();

router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    const getProducts = await manager.getProducts(limit);
    res.status(200).json({ status: "success", payload: getProducts });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const productId = await manager.getProductById(pid);
    const getId = `Product not found with the id:${pid} provided`;
    // primero se valida si el ID no existe, de ser asi retorna el correspondiente mensaje, caso contrario, retorna el mensaje estado exitoso
    !productId
      ? res.status(404).json({ status: "error", getId })
      : res.status(200).json({ status: "success", payload: productId });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const addProduct = await manager.addProduct(newProduct);
    //primero valida que los campos esten completos y que ademas el codigo no se repita, pero de ser asi retorna el mensaje correspondiente, caso contrario, retorna el mensaje de producto agregado
    addProduct
      ? res.status(404).json({
          status: "error",
          message: addProduct,
        })
      : res.status(200).json({ status: "success", message: "Add Product" });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const update = req.body;
  try {
    const getUpdate = await manager.updateProduct(pid, update);
    // primero se valida si el ID no existe por lo que retorna el correspondiente mensaje, caso contrario, retorna el mensaje de actualizacion exitosa
    !getUpdate
      ? res.status(404).json({
          status: "error",
          message: "The product with the specified ID does'n exist",
        })
      : res.status(200).json({ status: "success", payload: getUpdate });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const delProduct = await manager.deleteProduct(pid);
    // primero se valida si el ID no existe por lo que retorna el correspondiente mensaje, caso contrario, retorna el mensaje de borrado exitoso
    !delProduct
      ? res.status(404).json({
          status: "error",
          message: "The product with the specified ID does'n exist",
        })
      : res.status(200).json({ status: "success", payload: delProduct });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

export default router;
