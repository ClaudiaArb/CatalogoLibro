import { ILibro } from '../models/libro.js';

export class LibroView {
    private appContainer: HTMLElement;

    constructor() {
        this.appContainer = document.getElementById('app') || document.body;
    }

    public renderizarEstructuraBase(): void {
        this.appContainer.innerHTML = `
            <div class="contenedor-reino">
                
                <!-- Encabezado Principal -->
                <header class="header-reino">
                    <h1>Catálogo del Reino: Libros y Dragones</h1>
                    <p>Registro y custodia de tomos ancestrales</p>
                </header>

                <main>
                    <!-- Banner Visual con Ilustración del Castillo -->
                    <div class="banner-castillo">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHFg3iio-dxZ7rdihR0iGQQKxs1mqMalmBL2Xxx80kX3ll0mVB9wpCvo8wnDjYv-BboMtxUQhGRwql_kd4sZcHtovQ7e3V7i0L-1gAMt41kAE7CtmBcxEKGiIRpBfPs_92OlqoD_WNY-dFZfav3fddGQaJjEF8RRhDZXRG8mFDMF7f1oD3XyHPFq9Hvix7EQnNnMSctB7Xn9qRRRftoR75s-oOLHeXblT3ejhDvFNk-owXX04stWc" alt="Castillo medieval del reino">
                        <div class="banner-contenido">
                            <h2>Biblioteca del Reino</h2>
                            <p>Guarda y organiza los libros e historias de nuestro reino.</p>
                        </div>
                    </div>

                    <!-- Contenedor Bento (Formulario + Catálogo) -->
                    <div class="grid-principal">
                        
                        <!-- Formulario de Inscripción -->
                        <section class="seccion-formulario">
                            <h3>Inscribir Nuevo Libro</h3>
                            <form id="form-libro">
                                <div class="campo-formulario">
                                    <label for="titulo">Título del Tomo</label>
                                    <input type="text" id="titulo" placeholder="Ej: Grimorio de Fuego" required>
                                </div>

                                <div class="filas-dobles">
                                    <div class="campo-formulario">
                                        <label for="autor">Autor o Escriba</label>
                                        <input type="text" id="autor" placeholder="Ej: Mago Merlín" required>
                                    </div>

                                    <div class="campo-formulario">
                                        <label for="fecha">Año de Creación</label>
                                        <input type="number" id="fecha" placeholder="Ej: 1450" required>
                                    </div>
                                </div>

                                <div class="filas-dobles">
                                    <div class="campo-formulario">
                                        <label for="guardian">Guardián Asignado</label>
                                        <select id="guardian">
                                            <option value="Dragón 🐉">Dragón 🐉</option>
                                            <option value="Príncipe Aurion 👑">Príncipe Aurion 👑</option>
                                            <option value="Princesa Aurelia 👸">Princesa Aurelia 👸</option>
                                            <option value="Caballero Sir Gareth 🛡️">Caballero Sir Gareth 🛡️</option>
                                        </select>
                                    </div>

                                    <div class="campo-formulario">
                                        <label for="estado">Estado de Custodia</label>
                                        <select id="estado">
                                            <option value="pendiente">Pendiente</option>
                                            <option value="en progreso">En Progreso</option>
                                            <option value="leido">Leído</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="campo-formulario">
                                    <label for="descripcion">Descripción del Libro</label>
                                    <textarea id="descripcion" rows="3" placeholder="Escribe un breve resumen, reseña o historia del libro..."></textarea>
                                </div>

                                <button type="submit" class="btn-inscribir">Inscribir en el Catálogo</button>
                            </form>
                        </section>

                        <!-- Catálogo de Registros -->
                        <section class="seccion-catalogo">
                            <h3>Registros del Reino</h3>
                            
                            <div class="campo-formulario">
                                <input type="text" id="input-busqueda" placeholder="Buscar por título o autor...">
                            </div>

                            <div id="lista-libros" class="grid-libros">
                                <!-- Las tarjetas se cargan dinámicamente aquí -->
                            </div>
                        </section>

                    </div>
                </main>
            </div>
        `;
    }

    public mostrarLibros(libros: ILibro[]): void {
        const contenedorLista = document.getElementById('lista-libros');
        if (!contenedorLista) return;

        if (libros.length === 0) {
            contenedorLista.innerHTML = `<p style="color: var(--color-on-surface-variant); font-style: italic; grid-column: 1 / -1; text-align: center;">No hay libros registrados en la biblioteca.</p>`;
            return;
        }

        contenedorLista.innerHTML = libros.map(l => `
            <div class="tarjeta-libro" data-id="${l.id}">
                <div>
                    <span class="badge-estado">${l.estado}</span>
                    <h4>${l.titulo}</h4>
                    <p class="tarjeta-info"><em>Por:</em> ${l.autor}</p>
                    <p class="tarjeta-info"><em>Año:</em> ${l.fecha}</p>
                    <div class="tarjeta-guardian">
                        Guardián: ${l.guardian || 'Dragón 🐉'}
                    </div>
                </div>
                <div>
                    <button class="btn-eliminar" data-id="${l.id}">Destruir Registro</button>
                </div>
            </div>
        `).join('');
    }
}