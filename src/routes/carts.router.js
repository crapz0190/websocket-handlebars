import { Router } from "express";
import CartManager from "../manager/CartManager.js";
import dirname from "../utils.js";
import { join } from "node:path";

const manager = new CartManager(join(dirname, "/fileManagement", "carts.json"));
const router = Router();

router.get("/", async (req, res) => {
  try {
    const listCarts = await manager.readCart();
    res.status(200).json({ status: "success", payload: listCarts });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cartFound = await manager.getCartById(cid);
    const getId = `Product not found with the id:${cid} provided`;
    !cartFound
      ? res.status(404).json({ status: "error", message: getId })
      : res.status(200).json({ status: "success", payload: cartFound });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const addCart = await manager.addCart();
    res.status(200).json({ status: "success", addCart });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;
  try {
    const addProduct = await manager.addProductToCart(cid, pid);
    res.status(200).json({ status: "success", payload: addProduct });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const removeCart = await manager.deleteCart(cid);
    !removeCart
      ? res.status(404).json({
          status: "error",
          message: "The cart with the specified ID does'n exist",
        })
      : res.status(200).json({ status: "success", payload: removeCart });
  } catch (e) {
    res.status(500).json({ status: "error", message: e.message });
  }
});

export default router;
