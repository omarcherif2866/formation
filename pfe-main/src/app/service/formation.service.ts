import { Injectable } from '@angular/core';
import { Formation } from '../model/formation';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  constructor(private http: HttpClient) { }


  addFormation(data:any):Observable<Formation>{
    return this.http.post<Formation>("http://localhost:9090/formations",data)
  }

  getFormation(){
    return this.http.get<Formation[]>("http://localhost:9090/formations")
  }

  putFormation(id: any, data: FormData): Observable<Formation> {
    return this.http.put<Formation>(`http://localhost:9090/formations/${id}`, data);
  }


  deleteFormation(id:any):Observable<Formation>{
    return this.http.delete<Formation>("http://localhost:9090/formations/"+id)

  }

  addContenuFormation(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', file); // Utilisez 'pdf' comme clé pour envoyer le fichier PDF
  
    return this.http.put<any>(`http://localhost:9090/formations/contenu/${id}`, formData);
  }
  

  getFormationPDFById(id: any): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:9090/formations/${id}`);
  }


  getCoursBySession(sessionId: any): Observable<Formation[]> {
    return this.http.get<Formation[]>(`http://localhost:9090/formations/session/${sessionId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des formations :', error);
        return []; // Retourne un tableau vide en cas d'erreur pour éviter l'exception
      })
    );
  }

  sendCV(id: any, formData: FormData): Observable<any> {
    return this.http.post<any>("http://localhost:9090/formateur/send_email/" + id, formData, {
      reportProgress: true, // si nécessaire
      observe: 'events' // si nécessaire
    });
  }
  
  
}
