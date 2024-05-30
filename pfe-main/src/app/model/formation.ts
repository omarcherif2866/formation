import { Apprenant } from "./apprenant";
import { Domaine } from "./domaine";
import { Session } from "./session";

export interface Formation {
    _id: string;
    titre: string;
    description: string; 
    contenu: string[]; 
    apprenants: Apprenant[]; 
    domaine: Domaine;
    sessionCours:Session
}
