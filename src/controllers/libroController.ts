import { ILibro } from '../models/libro.js';
import { StorageService } from '../services/storageService.js';
import { LibroView } from '../views/libroView.js';

export class LibroController {
    private servicio: StorageService;
    private vista: LibroView;
    private libros: ILibro[] = [];

    constructor() {
        this.servicio = new StorageService();
        this.vista = new LibroView();
    }

    public async iniciar(): Promise<void> {
        this.vista.renderizarEstructuraBase();
        this.libros = await this.servicio.obtenerLibros();
        this.vista.mostrarLibros(this.libros);
        this.configurarEventos();
    }

    private configurarEventos(): void {
        const formulario = document.getElementById('form-libro') as HTMLFormElement;
        const inputBusqueda = document.getElementById('input-busqueda') as HTMLInputElement;
        const listaLibros = document.getElementById('lista-libros');

        // Evento para registrar un nuevo libro
        if (formulario) {
            formulario.addEventListener('submit', async (e) => {
                e.preventDefault();

                const titulo = (document.getElementById('titulo') as HTMLInputElement).value;
                const autor = (document.getElementById('autor') as HTMLInputElement).value;
                const fecha = Number((document.getElementById('fecha') as HTMLInputElement).value);
                const guardian = (document.getElementById('guardian') as HTMLSelectElement).value as any;
                const estado = (document.getElementById('estado') as HTMLSelectElement).value as any;
                const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value; // 👈 Captura correcta de la descripción

                const nuevoLibro: ILibro = {
                    id: Date.now().toString(),
                    titulo,
                    autor,
                    fecha,
                    guardian,
                    estado,
                    descripcion // 👈 Asignación al objeto
                };

                this.libros.push(nuevoLibro);
                await this.servicio.guardarLibros(this.libros);
                this.vista.mostrarLibros(this.libros);
                formulario.reset();
            });
        }

        // Evento para buscar/filtrar libros por título o autor en tiempo real
        if (inputBusqueda) {
            inputBusqueda.addEventListener('input', (e) => {
                const texto = (e.target as HTMLInputElement).value.toLowerCase();
                const filtrados = this.libros.filter(l => 
                    l.titulo.toLowerCase().includes(texto) || 
                    l.autor.toLowerCase().includes(texto)
                );
                this.vista.mostrarLibros(filtrados);
            });
        }

        // Evento para eliminar un libro
        if (listaLibros) {
            listaLibros.addEventListener('click', async (e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('btn-eliminar')) {
                    const id = target.getAttribute('data-id');
                    if (id) {
                        this.libros = this.libros.filter(l => l.id !== id);
                        await this.servicio.guardarLibros(this.libros);
                        this.vista.mostrarLibros(this.libros);
                    }
                }
            });
        }
    }
}