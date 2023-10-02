const socketClient = io();

// formulario de actualizar o eliminar productos
const listProducts = document.getElementById("listProducts");
const btnUpdate = document.getElementById("btnUpdate");
const btnDelete = document.getElementById("btnDelete");
const btnSubmit = document.getElementById("submit");
const idProduct = document.getElementById("idProduct");
const idProductForm = document.getElementById("idProductForm");
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const status = document.getElementById("status");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");

// formulario de crear productos
const newTitle = document.getElementById("newtitle");
const newDescription = document.getElementById("newdescription");
const newPrice = document.getElementById("newprice");
const newStatus = document.getElementById("newstatus");
const newCode = document.getElementById("newcode");
const newStock = document.getElementById("newstock");
const newCategory = document.getElementById("newcategory");
const newBtnSubmit = document.getElementById("newsubmit");

// identificar id
btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  socketClient.emit("idUpdate", idProduct.value);
});

// eliminar producto
btnDelete.addEventListener("click", (e) => {
  e.preventDefault();
  socketClient.emit("idDelete", idProduct.value);
  socketClient.on("loadlist", (data) => {
    console.log(data);
  });
  location.reload();
});

// Actualizar productos
socketClient.on("loadlist", (data) => {
  idProductForm.value = data.id;
  title.value = data.title;
  description.value = data.description;
  price.value = data.price;
  status.value = data.status;
  code.value = data.code;
  stock.value = data.stock;
  category.value = data.category;

  btnSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    updateList(
      idProductForm.value,
      title.value,
      description.value,
      price.value,
      status.value,
      code.value,
      stock.value,
      category.value
    );

    location.reload();
  });
});

const updateList = (
  idProductForm,
  title,
  description,
  price,
  status,
  code,
  stock,
  category
) => {
  socketClient.emit("updatelist", {
    idProductForm,
    title,
    description,
    price,
    status,
    code,
    stock,
    category,
  });
};

// Crear productos
newBtnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  newList(
    newTitle.value,
    newDescription.value,
    newPrice.value,
    newStatus.value,
    newCode.value,
    newStock.value,
    newCategory.value
  );

  location.reload();
});

const newList = (title, description, price, status, code, stock, category) => {
  socketClient.emit("createlist", {
    title,
    description,
    price,
    status,
    code,
    stock,
    category,
  });
};
