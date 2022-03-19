const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 8080;
const host = 'localhost';

let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

//Validacion dia o mes menor a numeral 10
let monthCheck = month < 10 ? `0${month}` : `${month}`;
let dayCheck = day < 10 ? `0${day}` : `${day}`;
let today = ` ${dayCheck}-${monthCheck}-${year}`;

const requestListener = (req, res) => {
  const params = url.parse(req.url, true).query;
  const nombreArchivo = params.archivo;
  const contenido = params.contenido;
  const leerArchivo = params.leer_archivo;
  const oldArchivo = params.old_archivo;
  const newArchivo = params.new_archivo;
  const eliminarArchivo = params.eliminar_archivo;

  // Formulario - Crear Nombre Archivo y Contenido
  if (req.url.includes('/crear')) {
    fs.writeFile(
      nombreArchivo,
      `Creado con fecha: ${today}\n${contenido}`,
      'utf-8',
      (err) => {
        if (err) {
          return console.log(err);
        }
        res.write(`Se ha creado el archivo ${nombreArchivo} con exito!`);
        res.end();
      }
    );
  }
  // Formulario - Leer Archivo Contenido
  if (req.url.includes('/leer')) {
    fs.readFile(leerArchivo, 'utf-8', (err, data) => {
      if (err) {
        return console.log(err);
      }
      console.log(`El archivo ${leerArchivo} fue leido con exito`);
      res.write(data);
      res.end();
    });
  }
  // Formulario - Renombrar Nombre Archivo / Mostrando nombre antiguo y nuevo a la vez
  if (req.url.includes('/renombrar')) {
    fs.rename(oldArchivo, newArchivo, (err) => {
      if (err) {
        return console.log(err);
      }
      res.write(`El archivo ${oldArchivo} fue renombrado por ${newArchivo}`);
      res.end();
    });
  }

  // Formulario - ELIMINAR Nombre Archivo c/ setTimeout de 3seg para el borrado

  if (req.url.includes('/eliminar')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(
      `<h3> Tu solicitud para eliminar el archivo ${eliminarArchivo} se está procesando</h3>`
    );
    setTimeout(() => {
      fs.unlink(eliminarArchivo, (err) => {
        if (err) {
          return console.log(err);
        }
        res.end(` El archivo ${eliminarArchivo} fue eliminado con exito`);
      });
    }, 3000);
  }

  // FIN BLQOUE
};

//JUNTANDO VARIABLES
const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`El servidor se esta ejecutando http://${host}:${port}`);
});
