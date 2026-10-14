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

    // Inicializamos la aplicación, renderizamos la vista y cargamos los libros
    public async iniciar(): Promise<void> {
        this.vista.renderizarEstructuraBase();
        this.registrarEventos();
        await this.cargarLibrosConTimeout();
    }

    // Patrón Timeout simulado con Promesas para evitar bloqueos
    private async cargarLibrosConTimeout(): Promise<void> {
        try {
            const promesaTimeout = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error("La consulta al catálogo del reino tardó demasiado.")), 3000)
            );

            this.libros = await Promise.race([
                this.servicio.obtenerLibros(),
                promesaTimeout
            ]);

            this.vista.mostrarLibros(this.libros);
        } catch (error) {
            console.error("Error:", error);
            alert((error as Error).message);
        }
    }

    // Configura los escuchadores de eventos del formulario y filtros
    private registrarEventos(): void {
        const formulario = document.getElementById('form-libro') as HTMLFormElement;
        const inputBusqueda = document.getElementById('input-busqueda') as HTMLInputElement;
        const filtroEstado = document.getElementById('filtro-estado') as HTMLSelectElement;
        const contenedorLista = document.getElementById('lista-libros');

        formulario?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.guardarNuevoLibro();
        });

        inputBusqueda?.addEventListener('input', () => this.filtrar());
        filtroEstado?.addEventListener('change', () => this.filtrar());

        contenedorLista?.addEventListener('click', async (e) => {
            const objetivo = e.target as HTMLElement;
            if (objetivo.classList.contains('btn-eliminar')) {
                const id = objetivo.getAttribute('data-id');
                if (id) await this.eliminarLibro(id);
            }
        });
    }

    // Guarda un nuevo libro
    private async guardarNuevoLibro(): Promise<void> {
        const titulo = (document.getElementById('titulo') as HTMLInputElement).value;
        const autor = (document.getElementById('autor') as HTMLInputElement).value;
        const fecha = Number((document.getElementById('fecha') as HTMLInputElement).value);
        const estado = (document.getElementById('estado') as HTMLSelectElement).value as 'pendiente' | 'leido' | 'en progreso';
        const guardian = (document.getElementById('guardian') as HTMLInputElement).value;

        const nuevoLibro: ILibro = {
            id: Date.now().toString(),
            titulo,
            autor,
            fecha,
            estado,
            guardian: guardian as 'Dragón ' | 'Príncipe ' | 'Princesa ' | 'Caballero '
        };

        this.libros.push(nuevoLibro);
        
        try {
            await this.servicio.guardarLibros(this.libros);
            this.vista.mostrarLibros(this.libros);
            (document.getElementById('form-libro') as HTMLFormElement).reset();
        } catch (err) {
            alert("No se pudo guardar el libro en el almacenamiento.");
        }
    }

    // Elimina un libro por ID único
    private async eliminarLibro(id: string): Promise<void> {
        this.libros = this.libros.filter(l => l.id !== id);
        await this.servicio.guardarLibros(this.libros);
        this.vista.mostrarLibros(this.libros);
    }

    // Filtra por texto y estado
    private filtrar(): void {
        const textoBusqueda = (document.getElementById('input-busqueda') as HTMLInputElement).value.toLowerCase();
        const estadoSeleccionado = (document.getElementById('filtro-estado') as HTMLSelectElement).value;

        const filtrados = this.libros.filter(l => {
            const coincideTexto = l.titulo.toLowerCase().includes(textoBusqueda) || l.autor.toLowerCase().includes(textoBusqueda);
            const coincideEstado = estadoSeleccionado === 'todos' || l.estado === estadoSeleccionado;
            return coincideTexto && coincideEstado;
        });

        this.vista.mostrarLibros(filtrados);
    }
}