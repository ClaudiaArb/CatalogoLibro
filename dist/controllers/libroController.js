import { StorageService } from '../services/storageService.js';
import { LibroView } from '../views/libroView.js';
export class LibroController {
    constructor() {
        this.libros = [];
        this.idLibroEditando = null;
        this.servicio = new StorageService();
        this.vista = new LibroView();
    }
    async iniciar() {
        this.libros = await this.servicio.obtenerLibros();
        this.actualizarVistaCompleta();
        this.configurarEventos();
    }
    actualizarVistaCompleta() {
        const stats = this.servicio.calcularEstadisticas(this.libros);
        this.vista.renderizarEstructuraBase(stats);
        this.vista.mostrarLibros(this.libros);
        this.reincoporarValoresFormulario();
    }
    configurarEventos() {
        const formulario = document.getElementById('form-libro');
        const inputBusqueda = document.getElementById('input-busqueda');
        const filtroGenero = document.getElementById('filtro-genero');
        const filtroEstado = document.getElementById('filtro-estado');
        const selectOrden = document.getElementById('select-orden');
        const listaLibros = document.getElementById('lista-libros');
        const btnCancelar = document.getElementById('btn-cancelar-edicion');
        // Manejar el envío del formulario (Crear o Actualizar)
        if (formulario) {
            formulario.addEventListener('submit', async (e) => {
                e.preventDefault();
                const titulo = document.getElementById('titulo').value;
                const autor = document.getElementById('autor').value;
                const fecha = Number(document.getElementById('fecha').value);
                const genero = document.getElementById('genero').value;
                const calificacion = Number(document.getElementById('calificacion').value);
                const guardian = document.getElementById('guardian').value;
                const estado = document.getElementById('estado').value;
                const descripcion = document.getElementById('descripcion').value;
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
                }
                else {
                    // Crear nuevo libro
                    const nuevoLibro = {
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
                formulario.reset();
                this.restaurarBotonFormulario();
            });
        }
        // Eventos combinados para Búsqueda, Filtros y Orden
        const aplicarFiltrosYOrden = () => {
            const texto = inputBusqueda ? inputBusqueda.value.toLowerCase() : '';
            const generoSel = filtroGenero ? filtroGenero.value : 'todos';
            const estadoSel = filtroEstado ? filtroEstado.value : 'todos';
            const ordenSel = selectOrden ? selectOrden.value : 'titulo-asc';
            let resultado = this.servicio.filtrarLibros(this.libros, texto, generoSel, estadoSel);
            resultado = this.servicio.ordenarLibros(resultado, ordenSel);
            this.vista.mostrarLibros(resultado);
        };
        if (inputBusqueda)
            inputBusqueda.addEventListener('input', aplicarFiltrosYOrden);
        if (filtroGenero)
            filtroGenero.addEventListener('change', aplicarFiltrosYOrden);
        if (filtroEstado)
            filtroEstado.addEventListener('change', aplicarFiltrosYOrden);
        if (selectOrden)
            selectOrden.addEventListener('change', aplicarFiltrosYOrden);
        // Eventos de la lista (Editar y Eliminar)
        if (listaLibros) {
            listaLibros.addEventListener('click', async (e) => {
                const target = e.target;
                const id = target.getAttribute('data-id');
                if (!id)
                    return;
                if (target.classList.contains('btn-eliminar')) {
                    const confirmar = confirm('¿Estás seguro de destruir este registro del reino?');
                    if (confirmar) {
                        this.libros = this.libros.filter(l => l.id !== id);
                        await this.servicio.guardarLibros(this.libros);
                        this.actualizarVistaCompleta();
                    }
                }
                else if (target.classList.contains('btn-editar')) {
                    const libroAEditar = this.libros.find(l => l.id === id);
                    if (libroAEditar) {
                        this.cargarLibroEnFormulario(libroAEditar);
                    }
                }
            });
        }
    }
    cargarLibroEnFormulario(libro) {
        this.idLibroEditando = libro.id;
        document.getElementById('titulo').value = libro.titulo;
        document.getElementById('autor').value = libro.autor;
        document.getElementById('fecha').value = libro.fecha.toString();
        document.getElementById('genero').value = libro.genero || 'Fantasía';
        document.getElementById('calificacion').value = (libro.calificacion || 5).toString();
        document.getElementById('guardian').value = libro.guardian;
        document.getElementById('estado').value = libro.estado;
        document.getElementById('descripcion').value = libro.descripcion || '';
        const tituloForm = document.getElementById('titulo-form');
        const btnSubmit = document.getElementById('btn-submit-form');
        const btnCancelar = document.getElementById('btn-cancelar-edicion');
        if (tituloForm)
            tituloForm.innerText = 'Editar Tomo del Reino';
        if (btnSubmit)
            btnSubmit.innerText = 'Guardar Cambios';
        if (btnCancelar)
            btnCancelar.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    restaurarBotonFormulario() {
        const tituloForm = document.getElementById('titulo-form');
        const btnSubmit = document.getElementById('btn-submit-form');
        const btnCancelar = document.getElementById('btn-cancelar-edicion');
        if (tituloForm)
            tituloForm.innerText = 'Inscribir Nuevo Libro';
        if (btnSubmit)
            btnSubmit.innerText = 'Inscribir en el Catálogo';
        if (btnCancelar)
            btnCancelar.style.display = 'none';
    }
    reincoporarValoresFormulario() {
        // Asegura que los eventos vuelvan a enlazarse tras renderizar la base
        this.configurarEventos();
    }
}
