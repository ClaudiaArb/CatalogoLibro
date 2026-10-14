import { ILibro } from '../models/libro.js';

export class StorageService {
    private storageKey = 'reino_libros';

    // Recupera los libros del localStorage simulando un retraso asíncrono
    public async obtenerLibros(): Promise<ILibro[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const datos = localStorage.getItem(this.storageKey);
                resolve(datos ? JSON.parse(datos) : []);
            }, 500);
        });
    }

    // Guarda la lista completa de libros en localStorage
    public async guardarLibros(libros: ILibro[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(this.storageKey, JSON.stringify(libros));
                resolve();
            }, 300);
        });
    }
}