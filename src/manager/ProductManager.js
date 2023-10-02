import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getID = async (id) => {
    try {
      const products = await this.getProducts();
      const idFound = products.find((product) => product.id === id);
      return idFound;
    } catch (e) {
      console.error(e);
    }
  };

  readProducts = async () => {
    try {
      if (existsSync(this.path)) {
        const readArrObj = await readFile(this.path, "utf-8");
        return JSON.parse(readArrObj);
      }

      return [];
    } catch (e) {
      console.error(e.message);
    }
  };

  writeProducts = async (productsAdded) => {
    try {
      return await writeFile(this.path, JSON.stringify(productsAdded));
    } catch (e) {
      console.error(e.message);
    }
  };

  addProduct = async (products) => {
    // primero realizo una desestructuracion de los datos ingresados por parametro (products), luego realizo una validacion para que todos los campos sean requeridos a excepcion de "THUMBNAIL", por consiguiente tambien se valida que el codigo no este repetido
    const listProducts = await this.readProducts();
    const { title, description, price, status, code, stock, category } =
      products;

    if (
      title === undefined ||
      description === undefined ||
      price === undefined ||
      status === undefined ||
      code === undefined ||
      stock === undefined ||
      category === undefined
    ) {
      return "All fields are required";
    } else {
      const verifyCode = listProducts.some((product) => product.code === code);
      if (verifyCode) {
        return `the code:${code} is repeated`;
      }
    }

    // validado lo anterior agrego un ID aleatorio al objeto, por consiguiente creo una nueva lista de productos que agrega un nuevo objeto al array de objetos existente
    try {
      const newProduct = { id: uuidv4(), ...products };
      const newListProducts = [...listProducts, newProduct];
      return await this.writeProducts(newListProducts);
    } catch (e) {
      console.error(e.message);
    }
  };

  getProducts = async (limit) => {
    try {
      const data = await this.readProducts();
      const setLimit = data.slice(0, limit);
      if (!limit) return data;
      return setLimit;
    } catch (e) {
      console.error(e);
    }
  };

  getProductById = async (id) => {
    try {
      const idFound = await this.getID(id);
      return idFound;
    } catch (e) {
      console.error(e);
    }
  };

  updateProduct = async (id, update) => {
    try {
      const idFound = await this.getID(id);
      const listProducts = await this.readProducts();
      const filtered = listProducts.filter((prod) => prod.id !== id);
      if (idFound) {
        const updateProduct = { id, ...update };
        const newArrProducts = [updateProduct, ...filtered];

        await this.writeProducts(newArrProducts);
        return `Product with id: ${id} has been updated `;
      }
    } catch (e) {
      console.error(e);
    }
  };

  deleteProduct = async (id) => {
    try {
      const idFound = await this.getID(id);
      if (idFound) {
        const products = await this.getProducts();
        const idFilter = products.filter((product) => product.id !== id);

        await this.writeProducts(idFilter);
        return `Product with id: ${id} has been removed`;
      }
    } catch (e) {
      console.error(e);
    }
  };
}

export default ProductManager;
