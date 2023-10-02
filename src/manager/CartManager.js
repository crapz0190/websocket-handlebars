import ProductManager from "./ProductManager.js";
import dirname from "../utils.js";
import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

const manager = new ProductManager(
  join(dirname, "../fileManagement", "products.json")
);

class CartManager {
  constructor(path) {
    this.path = path;
  }

  readCart = async () => {
    try {
      const carts = await readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (e) {
      console.error(e.message);
    }
  };

  writeCarts = async (cartsAdded) => {
    try {
      return await writeFile(this.path, JSON.stringify(cartsAdded));
    } catch (e) {
      console.error(e.message);
    }
  };

  getID = async (cid) => {
    try {
      const carts = await this.readCart();
      const idFound = carts.find((product) => product.id === cid);
      return idFound;
    } catch (e) {
      console.error(e);
    }
  };

  addCart = async () => {
    try {
      const listCarts = await this.readCart();
      const newCart = { id: uuidv4(), products: [] };
      const newListCarts = [...listCarts, newCart];
      await this.writeCarts(newListCarts);
      return "Cart Added";
    } catch (e) {
      console.error(e.message);
    }
  };

  getCartById = async (cid) => {
    try {
      const idFound = await this.getID(cid);
      return idFound;
    } catch (e) {
      console.error(e);
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
      // primero verifico que los id de (cartFound y prodFound) ingresados por parametros existen
      const cartFound = await this.getID(cid);
      const prodFound = await manager.getID(pid);
      // luego hago una lectura del path que contiene los datos del carrito
      const listCarts = await this.readCart();
      // por consiguiente, hago un filtrado utilizando el parametro (cid), lo cual arroja todos los id excepto el cid enviado por parametro en caso de coincidir
      const filtered = listCarts.filter((cart) => cart.id !== cid);

      if (cartFound && prodFound) {
        // verificada la existencia de los ids enviados por parametro, realizo otra validacion, si el PID del producto a agregar ya existe, simplemente incremento el quantity, caso contrario se agrega un nuevo producto al carrito
        const checkExist = cartFound.products.some((prod) => prod.id === pid);
        if (checkExist) {
          const idProduct = cartFound.products.find((prod) => prod.id === pid);
          // verificado ello, en el objeto ingreso a quantity y lo incremento
          idProduct.quantity++;
          // establezco un nuevo array de objetos ingresando el objeto modificado en su productos >> quantity, y luego agrego los demas objetos filtrados
          const newArr = [cartFound, ...filtered];
          await this.writeCarts(newArr);
          return "New Product Added To Cart";
        } else {
          // si el producto con el PID no existe en el carrito, simplemente lo agrego
          const newCart = {
            id: cid,
            products: [{ id: prodFound.id, quantity: 1 }],
          };
          const newListCarts = [newCart, ...filtered];
          await this.writeCarts(newListCarts);
          return "New Product Added To Cart";
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // no se solicita, pero lo incluyo para eliminar un carrito
  deleteCart = async (cid) => {
    try {
      const cartFound = await this.getID(cid);
      if (cartFound) {
        const carts = await this.readCart();
        const idFilter = carts.filter((cart) => cart.id !== cid);

        await this.writeCarts(idFilter);
        return `Cart with id: ${cid} has been removed`;
      }
    } catch (e) {
      console.error(e);
    }
  };
}

export default CartManager;
