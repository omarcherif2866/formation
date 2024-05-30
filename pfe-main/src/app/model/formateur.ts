import { Profil } from "./profil";

export interface Formateur {
    _id: string;
    fichiers: string[];
    status: 'En attente' | 'Accepté' | 'Rejeté';
    profil: Profil; 
}
