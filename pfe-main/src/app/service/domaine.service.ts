import { Injectable } from '@angular/core';
import { Profil } from '../model/profil';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Domaine } from '../model/domaine';
import { Formation } from '../model/formation';

@Injectable({
  providedIn: 'root'
})
export class DomaineService {


  constructor(private http: HttpClient, private router: Router) {

  }


  getDomaineById(id: any): Observable<Domaine> {
    return this.http.get<Domaine>('http://localhost:9090/domaine/' + id);
  } 

  getDomaine() {
    return this.http.get<Domaine[]>("http://localhost:9090/domaine");
  }

  addDomaine(data:any):Observable<Domaine>{
    return this.http.post<Domaine>("http://localhost:9090/domaine",data)
  }

  putDomaine(id: any, data: FormData): Observable<Domaine> {
    return this.http.put<Domaine>(`http://localhost:9090/domaine/${id}`, data);
  }


  deleteDomaine(id:any):Observable<Domaine>{
    return this.http.delete<Domaine>("http://localhost:9090/domaine/"+id)

  }

  getCoursByDomaine(DomaineId: number): Observable<Formation[]> {
    return this.http.get<Formation[]>(`http://localhost:9090/formations/domaine/${DomaineId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des formations :', error);
        return []; // Retourne un tableau vide en cas d'erreur pour éviter l'exception
      })
    );
  }
  

}
