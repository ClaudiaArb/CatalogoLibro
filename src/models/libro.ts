export type GuardianReino = 'Dragón 🐉' | 'Príncipe Aurion 👑' | 'Princesa Aurelia 👸' | 'Caballero Sir Gareth 🛡️';
export type GeneroLibro = 'Fantasía' | 'Ficción' | 'Aventura' | 'Misterio' | 'Historia' | 'Romance';

export interface ILibro {
    id: string;
    titulo: string;
    autor: string;
    fecha: number;
    estado: 'pendiente' | 'leido' | 'en progreso';
    guardian: GuardianReino;
    descripcion?: string;
    genero: GeneroLibro;
    calificacion: number; 
}