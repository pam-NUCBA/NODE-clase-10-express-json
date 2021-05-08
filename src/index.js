//* esta vez vamos a hacer un index que sea solo el arranque, así es más limpio ahora vamos a ir agregando cada vez más cosas
const app = require("./app");

//* se puede manejar el app.listen de forma asíncrona. Podríamos sino hacer el app.listen como siempre:
const main = async () => {
  await app.listen(app.get("port"));
  console.log(`escuchando en http://localhost:${app.get("port")}`);
};

main();

//* y ya este archivo está terminado! es solo un archivo de arranque