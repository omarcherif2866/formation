import { Formation } from "./formation";
import { Profil } from "./profil";

export interface Apprenant {
    _id: string;
    listCoursInscrits: Formation[];
    profil: Profil; 
}
