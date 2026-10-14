export type GuardianReino = 'Dragón ' | 'Príncipe ' | 'Princesa ' | 'Caballero ';

export interface ILibro {
    id: string;
    titulo: string;
    autor: string;
    fecha: number;
    estado: 'pendiente' | 'leido' | 'en progreso';
    guardian: GuardianReino;
}