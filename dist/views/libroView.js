export class LibroView {
    constructor() {
        this.appContainer = document.getElementById('app') || document.body;
    }
    renderizarEstructuraBase(stats) {
        this.appContainer.innerHTML = `
            <div class="contenedor-reino">
                
                <!-- Encabezado Principal -->
                <header class="header-reino">
                    <h1>Catálogo de Libros</h1>
                    <p>Bienvenido al reino de la lectura. Administra tus tomos, calificaciones y estadísticas de manera eficiente.</p>
                </header>
                <main>
                    <!-- Panel de Estadísticas del Reino -->
                    <div class="panel-estadisticas">
                        <div class="stat-card">
                            <span class="stat-number">${stats.total}</span>
                            <span class="stat-label">Total Libros</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.leidos}</span>
                            <span class="stat-label">Leídos</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${stats.pendientes}</span>
                            <span class="stat-label">Pendientes</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">⭐ ${stats.promedioCalificacion}</span>
                            <span class="stat-label">Promedio Calificación</span>
                        </div>
                    </div>

                    <!-- Banner Visual -->
                    <div class="banner-castillo">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHFg3iio-dxZ7rdihR0iGQQKxs1mqMalmBL2Xxx80kX3ll0mVB9wpCvo8wnDjYv-BboMtxUQhGRwql_kd4sZcHtovQ7e3V7i0L-1gAMt41kAE7CtmBcxEKGiIRpBfPs_92OlqoD_WNY-dFZfav3fddGQaJjEF8RRhDZXRG8mFDMF7f1oD3XyHPFq9Hvix7EQnNnMSctB7Xn9qRRRftoR75s-oOLHeXblT3ejhDvFNk-owXX04stWc" alt="Castillo medieval">
                        <div class="banner-contenido">
                            <h2>Biblioteca Real</h2>
                            <p>Gestiona tu colección de libros con facilidad y eficiencia.</p>
                        </div>
                    </div>

                    <!-- Contenedor Bento (Formulario y Catálogo) -->
                    <div class="grid-principal">
                        
                        <!-- Formulario de Inscripción / Edición -->
                        <section class="seccion-formulario">
                            <h3 id="titulo-form">Inscribir Nuevo Libro</h3>
                            <form id="form-libro">
                                <input type="hidden" id="libro-id" value="">

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
                                        <label for="genero">Género Literario</label>
                                        <select id="genero">
                                            <option value="Fantasía">Fantasía</option>
                                            <option value="Ficción">Ficción</option>
                                            <option value="Aventura">Aventura</option>
                                            <option value="Misterio">Misterio</option>
                                            <option value="Historia">Historia</option>
                                            <option value="Romance">Romance</option>
                                        </select>
                                    </div>
                                    <div class="campo-formulario">
                                        <label for="calificacion">Calificación (1-5)</label>
                                        <select id="calificacion">
                                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                            <option value="4">⭐⭐⭐⭐ (4)</option>
                                            <option value="3">⭐⭐⭐ (3)</option>
                                            <option value="2">⭐⭐ (2)</option>
                                            <option value="1">⭐ (1)</option>
                                        </select>
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
                                    <label for="descripcion">Descripción / Reseña</label>
                                    <textarea id="descripcion" rows="2" placeholder="Breve descripción..."></textarea>
                                </div>

                                <button type="submit" id="btn-submit-form" class="btn-inscribir">Inscribir en el Catálogo</button>
                                <button type="button" id="btn-cancelar-edicion" class="btn-cancelar" style="display:none; margin-top: 0.5rem; width:100%;">Cancelar Edición</button>
                            </form>
                        </section>

                        <!-- Catálogo y Controles de Búsqueda / Filtros -->
                        <section class="seccion-catalogo">
                            <h3>Registros del Reino</h3>
                            
                            <!-- Barra de Herramientas (Búsqueda, Filtros y Orden) -->
                            <div class="barra-herramientas">
                                <div class="campo-formulario" style="flex: 2;">
                                    <input type="text" id="input-busqueda" placeholder="Buscar por título, autor o género...">
                                </div>
                                <div class="campo-formulario" style="flex: 1;">
                                    <select id="filtro-genero">
                                        <option value="todos">Todos los Géneros</option>
                                        <option value="Fantasía">Fantasía</option>
                                        <option value="Ficción">Ficción</option>
                                        <option value="Aventura">Aventura</option>
                                        <option value="Misterio">Misterio</option>
                                        <option value="Historia">Historia</option>
                                        <option value="Romance">Romance</option>
                                    </select>
                                </div>
                                <div class="campo-formulario" style="flex: 1;">
                                    <select id="filtro-estado">
                                        <option value="todos">Todos los Estados</option>
                                        <option value="leido">Leídos</option>
                                        <option value="pendiente">Pendientes</option>
                                        <option value="en progreso">En Progreso</option>
                                    </select>
                                </div>
                                <div class="campo-formulario" style="flex: 1;">
                                    <select id="select-orden">
                                        <option value="titulo-asc">Título (A-Z)</option>
                                        <option value="titulo-desc">Título (Z-A)</option>
                                        <option value="anio-desc">Año (Más reciente)</option>
                                        <option value="anio-asc">Año (Más antiguo)</option>
                                    </select>
                                </div>
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
    mostrarLibros(libros) {
        const contenedorLista = document.getElementById('lista-libros');
        if (!contenedorLista)
            return;
        if (libros.length === 0) {
            contenedorLista.innerHTML = `<p style="color: var(--color-on-surface-variant); font-style: italic; grid-column: 1 / -1; text-align: center;">No se encontraron tomos registrados con estos criterios.</p>`;
            return;
        }
        contenedorLista.innerHTML = libros.map(l => `
            <div class="tarjeta-libro" data-id="${l.id}">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="badge-estado">${l.estado}</span>
                        <span class="badge-genero">${l.genero || 'General'}</span>
                    </div>
                    <h4>${l.titulo}</h4>
                    <p class="tarjeta-info"><em>Por:</em> ${l.autor}</p>
                    <p class="tarjeta-info"><em>Año:</em> ${l.fecha}</p>
                    <p class="tarjeta-info"><em>Calificación:</em> ${'⭐'.repeat(Number(l.calificacion) || 3)}</p>
                    ${l.descripcion ? `<p class="tarjeta-info" style="margin-top: 0.4rem; font-size: 0.85rem; color: var(--color-primary);">"${l.descripcion}"</p>` : ''}
                    <div class="tarjeta-guardian">
                        Guardián: ${l.guardian || 'Dragón 🐉'}
                    </div>
                </div>
                <div class="tarjeta-acciones" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn-editar" data-id="${l.id}" style="flex: 1; padding: 0.4rem; background: var(--color-primary-container); color: #270a03; border: none; border-radius: 0.25rem; font-family: 'Cinzel', serif; font-size: 0.7rem; font-weight:700; cursor:pointer;">Editar</button>
                    <button class="btn-eliminar" data-id="${l.id}" style="flex: 1; padding: 0.4rem; background: var(--color-secondary-container); color: #fff; border: none; border-radius: 0.25rem; font-family: 'Cinzel', serif; font-size: 0.7rem; font-weight:700; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        `).join('');
    }
}
