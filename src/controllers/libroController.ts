import { ILibro, GeneroLibro, GuardianReino } from '../models/libro.js';
import { StorageService } from '../services/storageService.js';
import { LibroView } from '../views/libroView.js';

export class LibroController {
    private servicio: StorageService;
    private vista: LibroView;
    private libros: ILibro[] = [];
    private idLibroEditando: string | null = null;

    constructor() {
        this.servicio = new StorageService();
        this.vista = new LibroView();
    }

    public async iniciar(): Promise<void> {
        this.libros = await this.servicio.obtenerLibros();
        this.actualizarVistaCompleta();
        this.configurarEventos();
    }

    private actualizarVistaCompleta(): void {
        const stats = this.servicio.calcularEstadisticas(this.libros);
        this.vista.renderizarEstructuraBase(stats);
        this.vista.mostrarLibros(this.libros);
        this.reincoporarValoresFormulario();
    }

    private configurarEventos(): void {
        const formulario = document.getElementById('form-libro') as HTMLFormElement;
        const inputBusqueda = document.getElementById('input-busqueda') as HTMLInputElement;
        const filtroGenero = document.getElementById('filtro-genero') as HTMLSelectElement;
        const filtroEstado = document.getElementById('filtro-estado') as HTMLSelectElement;
        const selectOrden = document.getElementById('select-orden') as HTMLSelectElement;
        const listaLibros = document.getElementById('lista-libros');
        const btnCancelar = document.getElementById('btn-cancelar-edicion') as HTMLButtonElement;

        // Manejar el envío del formulario (Crear o Actualizar)
        if (formulario) {
            formulario.addEventListener('submit', async (e) => {
                e.preventDefault();

                const titulo = (document.getElementById('titulo') as HTMLInputElement).value;
                const autor = (document.getElementById('autor') as HTMLInputElement).value;
                const fecha = Number((document.getElementById('fecha') as HTMLInputElement).value);
                const genero = (document.getElementById('genero') as HTMLSelectElement).value as GeneroLibro;
                const calificacion = Number((document.getElementById('calificacion') as HTMLSelectElement).value);
                const guardian = (document.getElementById('guardian') as HTMLSelectElement).value as GuardianReino;
                const estado = (document.getElementById('estado') as HTMLSelectElement).value as any;
                const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;

                if (this.idLibroEditando) {
                    // Actualizar libro existente
                    this.libros = this.libros.map(l => {
                        if (l.id === this.idLibroEditando) {
                            return {
                                ...l,
                                titulo,
                                autor,
                                fecha,
                                genero,
                                calificacion,
                                guardian,
                                estado,
                                descripcion
                            };
                        }
                        return l;
                    });
                    this.idLibroEditando = null;
                } else {
                    // Crear nuevo libro
                    const nuevoLibro: ILibro = {
                        id: Date.now().toString(),
                        titulo,
                        autor,
                        fecha,
                        genero,
                        calificacion,
                        guardian,
                        estado,
                        descripcion
                    };
                    this.libros.push(nuevoLibro);
                }

                await this.servicio.guardarLibros(this.libros);
                this.actualizarVistaCompleta();
                formulario.reset();
                this.restaurarBotonFormulario();
            });
        }

        // Cancelar modo edición
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                this.idLibroEditando = null;
                (formulario as HTMLFormElement).reset();
                this.restaurarBotonFormulario();
            });
        }

        // Eventos combinados para Búsqueda, Filtros y Orden
        const aplicarFiltrosYOrden = () => {
            const texto = inputBusqueda ? inputBusqueda.value.toLowerCase() : '';
            const generoSel = filtroGenero ? filtroGenero.value : 'todos';
            const estadoSel = filtroEstado ? filtroEstado.value : 'todos';
            const ordenSel = selectOrden ? selectOrden.value as any : 'titulo-asc';

            let resultado = this.servicio.filtrarLibros(this.libros, texto, generoSel, estadoSel);
            resultado = this.servicio.ordenarLibros(resultado, ordenSel);

            this.vista.mostrarLibros(resultado);
        };

        if (inputBusqueda) inputBusqueda.addEventListener('input', aplicarFiltrosYOrden);
        if (filtroGenero) filtroGenero.addEventListener('change', aplicarFiltrosYOrden);
        if (filtroEstado) filtroEstado.addEventListener('change', aplicarFiltrosYOrden);
        if (selectOrden) selectOrden.addEventListener('change', aplicarFiltrosYOrden);

        // Eventos de la lista (Editar y Eliminar)
        if (listaLibros) {
            listaLibros.addEventListener('click', async (e) => {
                const target = e.target as HTMLElement;
                const id = target.getAttribute('data-id');

                if (!id) return;

                if (target.classList.contains('btn-eliminar')) {
                    const confirmar = confirm('¿Estás seguro de destruir este registro del reino?');
                    if (confirmar) {
                        this.libros = this.libros.filter(l => l.id !== id);
                        await this.servicio.guardarLibros(this.libros);
                        this.actualizarVistaCompleta();
                    }
                } else if (target.classList.contains('btn-editar')) {
                    const libroAEditar = this.libros.find(l => l.id === id);
                    if (libroAEditar) {
                        this.cargarLibroEnFormulario(libroAEditar);
                    }
                }
            });
        }
    }

    private cargarLibroEnFormulario(libro: ILibro): void {
        this.idLibroEditando = libro.id;

        (document.getElementById('titulo') as HTMLInputElement).value = libro.titulo;
        (document.getElementById('autor') as HTMLInputElement).value = libro.autor;
        (document.getElementById('fecha') as HTMLInputElement).value = libro.fecha.toString();
        (document.getElementById('genero') as HTMLSelectElement).value = libro.genero || 'Fantasía';
        (document.getElementById('calificacion') as HTMLSelectElement).value = (libro.calificacion || 5).toString();
        (document.getElementById('guardian') as HTMLSelectElement).value = libro.guardian;
        (document.getElementById('estado') as HTMLSelectElement).value = libro.estado;
        (document.getElementById('descripcion') as HTMLTextAreaElement).value = libro.descripcion || '';

        const tituloForm = document.getElementById('titulo-form');
        const btnSubmit = document.getElementById('btn-submit-form') as HTMLButtonElement;
        const btnCancelar = document.getElementById('btn-cancelar-edicion') as HTMLButtonElement;

        if (tituloForm) tituloForm.innerText = 'Editar Tomo del Reino';
        if (btnSubmit) btnSubmit.innerText = 'Guardar Cambios';
        if (btnCancelar) btnCancelar.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private restaurarBotonFormulario(): void {
        const tituloForm = document.getElementById('titulo-form');
        const btnSubmit = document.getElementById('btn-submit-form') as HTMLButtonElement;
        const btnCancelar = document.getElementById('btn-cancelar-edicion') as HTMLButtonElement;

        if (tituloForm) tituloForm.innerText = 'Inscribir Nuevo Libro';
        if (btnSubmit) btnSubmit.innerText = 'Inscribir en el Catálogo';
        if (btnCancelar) btnCancelar.style.display = 'none';
    }

    private reincoporarValoresFormulario(): void {
        // Asegura que los eventos vuelvan a enlazarse tras renderizar la base
        this.configurarEventos();
    }
}