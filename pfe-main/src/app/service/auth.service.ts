import { Injectable } from '@angular/core';
import { Profil } from '../model/profil';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    // Initialisez le BehaviorSubject à false ou à la valeur stockée dans localStorage
    const storedLoggedIn = localStorage.getItem('loggedIn');
    this.loggedInSubject = new BehaviorSubject<boolean>(storedLoggedIn ? JSON.parse(storedLoggedIn) : false);

  }




  createAcount(data:any){
    return this.http.post<Profil>("http://localhost:9090/api/signup",data)
  }

  getUser() :Observable<Profil[]>{
    return this.http.get<Profil[]>("http://localhost:9090/api/user");
  }

  getUserProfile(id:any) {
    return this.http.get('http://localhost:9090/api/user/'+id)
  }

  updateUserPassword(id: any, motdepasse: string, newPassword: string): Observable<any> {
    const data = {
      password: motdepasse,
      newpassword: newPassword
    };
  
    return this.http.put<any>(`http://localhost:9090/api/user/password/${id}`, data);
  }

  // signIn(credentials:any): Observable<Profil>{
  //   return this.http.post<Profil>("http://localhost:9090/api/signin",credentials)
  // }

  signIn(credentials: any): Observable<Profil> {
    return this.http.post<Profil>("http://localhost:9090/api/signin", credentials).pipe(
      tap((user: Profil) => {
        // Mettez à jour l'état de connexion à true dès que l'utilisateur se connecte avec succès
        this.setLoggedIn(true);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userAdresse', user.adresse);
        console.log('userRole', user.role);

      }),
      // catchError(this.handleError) // Gérez les erreurs HTTP
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); // Retournez le BehaviorSubject en tant qu'Observable
  }

  setLoggedIn(status: boolean) {
    this.loggedInSubject.next(status); // Mettez à jour l'état de connexion avec le BehaviorSubject
    // Stockez également l'état de connexion dans le localStorage
    localStorage.setItem('loggedIn', JSON.stringify(status));
  }

  private handleError(error: HttpErrorResponse): Observable<string> {
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.status === 401) {
      errorMessage = 'Unauthorized access: ' + error.error.message;
    } else if (error.status === 403) {
      errorMessage = 'Access Denied: ' + JSON.stringify(error.error.message); // Convertir l'objet en chaîne de caractères
    } else {
      errorMessage = 'An error occurred: ' + JSON.stringify(error.error.message); // Convertir l'objet en chaîne de caractères
    }
    console.error('Error details:', error);
    return throwError(errorMessage);
  }
  
  

  logout(): void {
    this.setLoggedIn(false); // Définissez loggedIn sur false
    localStorage.removeItem('loggedIn'); // Supprimez l'état de connexion du localStorage
    localStorage.removeItem('user_id'); // Supprimez l'ID de l'utilisateur du localStorage
  }

  updateUserProfile(id: string, formData: FormData ): Observable<Profil> {

    return this.http.put<Profil>(`http://localhost:9090/api/user/profile/${id}`, formData);
  }

  updateProfileByAdmin(id: string, userData: any ): Observable<Profil> {

    return this.http.put<Profil>(`http://localhost:9090/api/user/updateProfileByAdmin/${id}`, userData);
  }

  deleteUser(id:any):Observable<Profil>{
    return this.http.delete<Profil>("http://localhost:9090/api/user/updateProfileByAdmin/"+id)

  }

  countApprenantPerDate(year: number): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/apprenant/countApprenantPerDate/${year}`);
  }

  countAllApprenant(): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/apprenant/countAllApprenant`);
  }

  countFormateurPerDate(year: number): Observable<any> {
    return this.http.get<any>(`http://localhost:9090/formateur/countFormateurPerDate/${year}`);
  }

  countAllFormateur(): Observable<any> {
    return this.http.get<any>("http://localhost:9090/formateur/count");
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userAdresse');
  }

  forget(adresse: string): Observable<any> {
    const credentials = { adresse };
    return this.http.post<any>('http://localhost:9090/user/forgotPassword', credentials);
  }

  resetPassword(userId: string, motdepasse: string): Observable<any> {
    return this.http.put<any>(`http://localhost:9090/api/user/password/${userId}`, { motdepasse });
  }
}
