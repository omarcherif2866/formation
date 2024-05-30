// import { Component } from '@angular/core';
// import { AuthService } from '../service/auth.service';
// import { Profil } from '../model/profil';
// import { Domaine } from '../model/domaine';
// import { DomaineService } from '../service/domaine.service';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })


// export class NavbarComponent {
//   isFormateur: boolean = false;
//   authenticated = false;
//   idUser: any;
//   showDropdown: boolean = false;
//   domaines: Domaine[] = [];
  
//   constructor(private authService: AuthService, private DomaineService: DomaineService) {}

//   ngOnInit(): void {
//     // Vérifiez si l'utilisateur est connecté
//     this.authService.isLoggedIn().subscribe((loggedIn) => {
//       this.authenticated = loggedIn;
//       console.log('Utilisateur connecté ?', loggedIn);

//         // Récupérer le rôle de l'utilisateur depuis le localStorage
//         const userRole = localStorage.getItem('userRole');
//         // Vérifier si le rôle de l'utilisateur est "formateur"
//         this.isFormateur = userRole === 'formateur';


//       // Si l'utilisateur est connecté, récupérez son ID
//       if (loggedIn) {
//         const id = localStorage.getItem('user_id');
//         console.log('ID de l\'utilisateur connecté :', id); // Vérifiez que l'ID est correctement récupéré

//         // Récupérez le profil de l'utilisateur uniquement si l'ID est défini
//         if (id) {
//           this.authService.getUserProfile(id).subscribe((user: any) => {
//             if (user && user.id) { 
//               this.idUser = user.id; 
//               console.log('ID de l\'utilisateur connecté :', this.idUser); 
//             }
//           });
//         } else {
//           console.log('L\'ID de l\'utilisateur est null'); // Affichez un message d'erreur si l'ID est null
//         }
//       }
//     });



//     this.getDomaines();


//   }

//   logout(): void {
//     this.authService.logout();
//     console.log('Vous êtes déconnecté');
//   }


//   getDomaines(): void {
//     this.DomaineService.getDomaine().subscribe(domaines => {
//       this.domaines = domaines;
//     });
//   }
  
  

  
// }


import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Domaine } from '../model/domaine';
import { DomaineService } from '../service/domaine.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  authenticated = false;
  isAdmin = false;
  isFormateur = false;
  idUser: any;
  showDropdown = false;
  domaines: Domaine[] = [];

  constructor(private authService: AuthService, private domaineService: DomaineService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.authenticated = loggedIn;
      console.log('Utilisateur connecté ?', loggedIn);
  
      if (loggedIn) {
        const id = localStorage.getItem('user_id');
        console.log('ID de l\'utilisateur connecté :', id); // Vérifiez que l'ID est correctement récupéré
        if (!this.idUser) { // Utilisez uniquement l'ID du stockage local s'il n'est pas déjà défini
          this.idUser = id;
        }
        const userRole = localStorage.getItem('userRole');
        this.isAdmin = userRole === 'admin';
        this.isFormateur = userRole === 'formateur';
      } else {
        this.isAdmin = false;
        this.isFormateur = false;
      }
    });
  
    this.route.params.subscribe(params => {
      if (!this.idUser) { // Utilisez uniquement l'ID des paramètres de l'URL s'il n'est pas déjà défini
        this.idUser = params['id'];
      }
    });
  
    this.getDomaines();
  }
  

  logout(): void {
    this.authService.logout();

      Swal.fire({
        icon: 'error',
        title: 'Vous êtes deconnecté',
        showConfirmButton: false,
        timer: 1500
      });
    
    this.isAdmin = false;
    this.isFormateur = false;
    this.router.navigate(['/Inscrivez-vous']);
  }

  getDomaines(): void {
    this.domaineService.getDomaine().subscribe(domaines => {
      this.domaines = domaines;
    });
  }

  redirectToDomaineCours(domaineId: string) {
    this.router.navigate(['/Domaines', domaineId]);
  }
}



