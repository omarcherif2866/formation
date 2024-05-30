import { Injectable } from '@angular/core';
import { Profil } from '../model/profil';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Formateur } from '../model/formateur';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  constructor(private http: HttpClient, private router: Router) {
  }

  createAcountFormateur(data:any) : Observable<Formateur>{
    return this.http.post<Formateur>("http://localhost:9090/formateur/signup",data)
  }

  addCVFormateur(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file); // Utilisez 'pdf' comme clé pour envoyer le fichier PDF
  
    return this.http.put<any>(`http://localhost:9090/formateur/contenu/${id}`, formData);
  }

  getFormateurId(id: any): Observable<Formateur> {
    return this.http.get<Formateur>('http://localhost:9090/formateur/' + id);
  } 

  getFormateur(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>('http://localhost:9090/formateur/');
  } 

  getFormateurByProfil(profilId: number): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(`http://localhost:9090/formateur/profil/${profilId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération du formateur :', error);
        return []; // Retourne un tableau vide en cas d'erreur pour éviter l'exception
      })
    );
  }

  updateFormateur(id: string, formData: FormData ): Observable<Formateur> {

    return this.http.put<Formateur>(`http://localhost:9090/formateur/${id}`, formData);
  }

  deleteFormateur(id:any):Observable<Formateur>{
    return this.http.delete<Formateur>("http://localhost:9090/formateur/"+id)

  }
}
