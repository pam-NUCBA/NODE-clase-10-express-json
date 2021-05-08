const express = require("express");
const router = express.Router();
const fs = require("fs");
const uuid = require("uuid");

//*array base para crear productos:
//*una vez que agregue el archivo comentar este array
// const products = [];
//*estoy usando este: https://regexr.com/3g1v7
const imgRegexp = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;

//*archivo json: traerlo una vez que esté listo el pushear a products = [].
//*con esto lee el archivo desde el inicio
const json_products = fs.readFileSync("src/data/products.json", "utf-8");
let products = JSON.parse(json_products);

//*ruta base
router.get("/", (req, res) => {
  // res.send('hola')
  //*traer la vista:
  res.render("index.ejs", {
    products,
  });
});

//*formulario:
router.get("/new-product", (req, res) => {
  res.render("new-product", {
    pageTitle: "New Product",
    button: "Add a product",
  });
});

//*acá es a donde va a mandar los datos el new-product.ejs:
router.post("/new-product", (req, res) => {
  //* los datos van a venir por el req.body en forma de objeto: toma los name del form.
  console.log(req.body);
  //*con esto podemos ahora rerutear cuando creo un producto (no sería la mejor idea pero se puede)
  // res.send("todo ok!");
  //*para ver que el regexp funciona:
  //console.log( imgRegexp.test(req.body.picture))
  //*grabamos el req.body en el modelo:

  const { title, description, picture } = req.body;
  if (!title || !description || !picture || imgRegexp.test(picture) == false) {
    res
      .status(400)
      .send("Inputs shouldn't be empty and the image url must be valid!");
  } else {
    const newProduct = {
      id: uuid.v4(),
      // title,
      // description,
      // picture,
      ...req.body,
    };
    products.push(newProduct);

    //*nuestro viejo amigo, fs:
    fs.writeFile(
      "src/data/products.json",
      JSON.stringify(products, null, 2),
      "utf-8",
      (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log(success, "funciona!!");
        }
      }
    );
    // res.send("todo ok!");
    //*podemos hacer que al crear un nuevo producto redireccione acá automáticamente!
    res.redirect("/");
  }
});

router.get("/delete/:id", (req, res) => {
  products = products.filter((product) => product.id !== req.params.id);
  fs.writeFileSync(
    "src/data/products.json",
    JSON.stringify(products, null, 2),
    "utf-8"
  );

  res.redirect("/");
});

router.get("/edit-product/:id", (req, res) => {
  const selectedProd = products.filter(
    (product) => product.id === req.params.id
  );
  res.render(`edit-product.ejs`, {
    pageTitle: "Edit this Product",
    originalId: selectedProd[0].id,
    title: selectedProd[0].title,
    description: selectedProd[0].description,
    picture: selectedProd[0].picture,
    button: "Edit this product",
  });
});

router.post("/update-product/", (req, res) => {
  const { title, description, picture } = req.body;
  const originalId = req.headers.referer;
  const newId = originalId.substr(originalId.length - 36);

  console.log(newId, "newId");

  if (!title || !description || !picture || imgRegexp.test(picture) == false) {
    res
      .status(400)
      .send("Inputs shouldn't be empty and the image url must be valid!");
  } else {
    // console.log(req.body)
    const updateProduct = {
      ...req.body,
    };
    products.push(updateProduct);
    console.log(updateProduct, "update");
    const findProduct = products.filter((product) => product.id === newId);
    if (findProduct) {
      fs.writeFile(
        "src/data/products.json",
        JSON.stringify(updateProduct, null, 2),
        "utf-8",
        (err, success) => {
          if (err) {
            console.log(err);
          } else {
            console.log(success, "funciona!");
          }
        }
      );
    } else {
      res.send("Couldn't find the id");
    }

    res.redirect("/");
  }
});

module.exports = router;
