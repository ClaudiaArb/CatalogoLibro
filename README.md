# Catálogo del Reino - Laboratorio de Programación Orientada a Eventos

Este proyecto es una aplicación web tipo catálogo de libros con una temática de fantasía medieval, desarrollada como parte de la práctica de la carrera de Ingeniería en Desarrollo de Software (UNIVO).

## ¿Qué hace la aplicación?
Permite llevar el registro y la administración de una biblioteca de tomos antiguos. Cuenta con las siguientes funciones:
- **Inscripción de libros:** Formulario para agregar títulos indicando autor, año, estado de lectura, una descripción y un guardián asignado.
- **Buscador en tiempo real:** Permite filtrar los libros instantáneamente mientras escribes el nombre o el autor.
- **Eliminación de registros:** Opción para borrar tomos de la lista.
- **Persistencia de datos:** Los datos se guardan en el navegador (`localStorage`) para que no se pierdan al recargar la página.

## Tecnologías utilizadas
- HTML5 y CSS3 (con estilos personalizados y tipografías de Google Fonts).
- TypeScript aplicando la arquitectura MVC (Model-View-Controller) y programación orientada a eventos.

## ¿Cómo ejecutarlo?
1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Compilar los archivos de TypeScript con el comando:
   ```bash
   npx tsc