import { LibroController } from './controllers/libroController.js';

document.addEventListener('DOMContentLoaded', () => {
    const controller = new LibroController();
    controller.iniciar();
});