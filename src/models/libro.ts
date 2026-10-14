export type GuardianReino = 'Dragón 🐉' | 'Príncipe Aurion 👑' | 'Princesa Aurelia 👸' | 'Caballero Sir Gareth 🛡️';

export interface ILibro {
    id: string;
    titulo: string;
    autor: string;
    fecha: number;
    estado: 'pendiente' | 'leido' | 'en progreso';
    guardian: GuardianReino;
    descripcion?: string; 
}