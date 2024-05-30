export interface Profil {
    _id: string;
    nom: string;
    adresse: string;
    motdepasse: string; 
    role: 'apprenant' | 'formateur' | 'admin';
    image: any
}
