import { Injectable } from '@angular/core';
import { Session } from '../model/session';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) { }

  getAllSession(){
    return this.http.get<Session[]>("http://localhost:9090/sessionCours")
  }

  getSessionById(id: any): Observable<Session> {
    return this.http.get<Session>('http://localhost:9090/sessionCours/' + id);
  } 
}
