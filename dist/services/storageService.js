export class StorageService {
    constructor() {
        this.storageKey = 'reino_libros_parcial2';
    }
    // Obtiene todos los libros guardados
    async obtenerLibros() {
        return new Promise((resolve) => {
            const datos = localStorage.getItem(this.storageKey);
            resolve(datos ? JSON.parse(datos) : []);
        });
    }
    // Guarda la lista completa de libros
    async guardarLibros(libros) {
        return new Promise((resolve) => {
            localStorage.setItem(this.storageKey, JSON.stringify(libros));
            resolve();
        });
    }
    // Calcula estadísticas completas para el panel
    calcularEstadisticas(libros) {
        const total = libros.length;
        const leidos = libros.filter(l => l.estado === 'leido').length;
        const pendientes = libros.filter(l => l.estado === 'pendiente').length;
        const enProgreso = libros.filter(l => l.estado === 'en progreso').length;
        const sumaCalificaciones = libros.reduce((acc, l) => acc + (Number(l.calificacion) || 0), 0);
        const promedio = total > 0 ? (sumaCalificaciones / total).toFixed(1) : '0.0';
        return {
            total,
            leidos,
            pendientes,
            enProgreso,
            promedioCalificacion: promedio
        };
    }
    // Filtros avanzados combinados (por texto, género y estado)
    filtrarLibros(libros, texto, genero, estado) {
        return libros.filter(l => {
            const coincideTexto = texto === '' ||
                l.titulo.toLowerCase().includes(texto) ||
                l.autor.toLowerCase().includes(texto) ||
                l.genero.toLowerCase().includes(texto);
            const coincideGenero = genero === 'todos' || l.genero === genero;
            const coincideEstado = estado === 'todos' || l.estado === estado;
            return coincideTexto && coincideGenero && coincideEstado;
        });
    }
    // Ordenamiento por título o año
    ordenarLibros(libros, criterio) {
        const copia = [...libros];
        return copia.sort((a, b) => {
            if (criterio === 'titulo-asc')
                return a.titulo.localeCompare(b.titulo);
            if (criterio === 'titulo-desc')
                return b.titulo.localeCompare(a.titulo);
            if (criterio === 'anio-asc')
                return a.fecha - b.fecha;
            if (criterio === 'anio-desc')
                return b.fecha - a.fecha;
            return 0;
        });
    }
}
