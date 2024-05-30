import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Profil } from '../model/profil';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationService } from '../service/formation.service';
import { DomaineService } from '../service/domaine.service';
import { Domaine } from '../model/domaine';
import { Formation } from '../model/formation';
import { Session } from '../model/session';
import { SessionService } from '../service/session.service';
import { Chart, ChartOptions, registerables } from 'chart.js/auto';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { Formateur } from '../model/formateur';
import { FormateurService } from '../service/formateur.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  displayUsers: boolean = false;
  displayFormateurs: boolean = false;
  displayCompteur: boolean = false;
  displayCourses: boolean = false;
  displayDomains: boolean = false;
  pageTitle: string = '';
  usr: Profil[] = [];
  formateurs: Formateur[] = [];

  imageUrl: string | ArrayBuffer | null = null;
  @Input() fullWidthMode = false;
  FormationForm!: FormGroup;
  DomaineForm!: FormGroup;
  UserForm!: FormGroup;
  formateurForm!: FormGroup;
  domaines: Domaine[] = [];
  sessionCourss: Session[] = [];

  formations: Formation[] = [];
  afficherForm: string = '';
  selectedFormation: Formation | null = null;
  selectedDomaine: Domaine | null = null;
  selectedUser: Profil | null = null;
  selectedFormateur: Formateur | null = null;

  formateuryear!: number;
  apprenantyear!: number;

  yearOptions: number[] = [];
  apprenantCount!: number;
  AllApprenantCount!: number;
  AllFormateurCount!: number;
  formateurCount!: number;

// Déclaration de la propriété pieChartPerYear de type Chart
pieChartPerYear!: any;

  constructor(
    private formateurService: FormateurService,
    private sessionService: SessionService,
    private authService: AuthService,
    private domaineService: DomaineService,
    private formationService: FormationService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    this.FormationForm = this.formBuilder.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      domaine: ['', Validators.required],
      sessionCours: ['', Validators.required],
    });

    this.formateurForm = this.formBuilder.group({
      status: ['', Validators.required],
    });

    this.DomaineForm = this.formBuilder.group({
      type: ['', Validators.required],
  });

    this.getAllSession();
    this.getDomaines();
    this.getUsers();
    this.showUsers();
    this.getFormations();
    this.getFormateurs();

    this.setYearOptions();
    this.apprenantyear = new Date().getFullYear();
    this.formateuryear = new Date().getFullYear();

    this.countApprenants();
    this.countAllApprenants();
    this.countAllFormateur();
    this.countFormateur();
    this.loadDataAndDrawChart();
  }

  afficherFormulaire(form: string) {
    this.afficherForm = form;
  }

  closeForm() {
    this.afficherForm = ''; // Réinitialiser la valeur pour masquer le formulaire
    this.selectedFormation = null; // Réinitialiser la formation sélectionnée
    this.FormationForm.reset(); // Réinitialiser les champs du formulaire
    this.UserForm.reset(); // Réinitialiser les champs du formulaire
    this.formateurForm.reset(); // Réinitialiser le formulaire uniquement s'il est défini
  }

  getUsers() {
    this.authService.getUser().subscribe(users  => {
      // Filtrer les utilisateurs pour n'afficher que ceux qui ne sont pas des formateurs
      this.usr = users.filter(user => user.role !== 'formateur');
  
      console.log("usr:", this.usr);
    }, error => {
      console.error('Error fetching users:', error);
    });
  }
  





  getProfileImageUrl(imageName: string): string {
    return `http://localhost:9090/img/${imageName}`;
  }

  showUsers() {
    this.displayUsers = true;
    this.displayCourses = false;
    this.displayDomains = false;
    this.displayCompteur = false;
    this.displayFormateurs = false;

    this.pageTitle = 'Tous les Utilisateurs';
  }

  showCourses() {
    this.displayUsers = false;
    this.displayCourses = true;
    this.displayDomains = false;
    this.displayCompteur = false;
    this.displayFormateurs = false;

    this.pageTitle = 'Ajouter une Formation';
  }

  showDomains() {
    this.displayUsers = false;
    this.displayCourses = false;
    this.displayDomains = true;
    this.displayCompteur = false;
    this.displayFormateurs = false;

    this.pageTitle = 'Domaines';
  }

  showCompteur() {
    this.displayUsers = false;
    this.displayCourses = false;
    this.displayDomains = false;
    this.displayCompteur = true;
    this.displayFormateurs = false;

    this.pageTitle = 'Statistiques';
    this.loadDataAndDrawChartPerYear();
    this.loadDataAndDrawChart()
  }

  showFormateur() {
    this.displayUsers = false;
    this.displayCourses = false;
    this.displayDomains = false;
    this.displayCompteur = false;
    this.displayFormateurs = true;

    this.pageTitle = 'Formateurs';
  }

  getDomaines(): void {
    this.domaineService.getDomaine().subscribe(domaines => {
      this.domaines = domaines;
      console.log("Domaines récupérés:", this.domaines);
    });
  }

  getAllSession(): void {
    this.sessionService.getAllSession().subscribe(ss => {
      this.sessionCourss = ss;
      console.log("sessions récupérés:", ss);
    });
  }

  getFormations(): void {
    this.formationService.getFormation().subscribe(formation => {
      this.formations = formation;
      this.formations.forEach(form => {
        this.domaineService.getDomaineById(form.domaine).subscribe(domaine => {
          form.domaine = domaine;
        });
      });
      this.formations.forEach(form => {
        this.sessionService.getSessionById(form.sessionCours).subscribe(sessions => { // Modification ici
          form.sessionCours = sessions; // Modification ici
        });
      });
      

    });
  }

// ----------------------------------------------------------------------
// ------------------------------Fromation-------------------------------
// ----------------------------------------------------------------------


  saveOrUpdate() {
    if (this.FormationForm.valid) {
      const formationData = {
        titre: this.FormationForm.value.titre,
        description: this.FormationForm.value.description,
        domaine: this.FormationForm.value.domaine,
        sessionCours: this.FormationForm.value.sessionCours

      };
  
      if (this.selectedFormation) {
        // Si une formation est sélectionnée pour la modification
        this.updateFormation(this.selectedFormation._id, formationData);
        this.closeForm(); // Fermer le formulaire après l'ajout
        this.getFormations();
      } else {
        // Sinon, ajouter une nouvelle formation
        this.addFormation(formationData);

      }
    }
  }
  
  addFormation(formationData: any) {
    this.formationService.addFormation(formationData).subscribe(
      res => {
        Swal.fire({
          icon: 'success',
          title: 'Formation ajoutée avec succès',
          showConfirmButton: false,
          timer: 1500
        })
        // console.log('Formation ajoutée avec succès');
        this.closeForm(); // Fermer le formulaire après l'ajout
        this.getFormations();
            },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'ajout de la formation',
          showConfirmButton: false,
          timer: 1500
        })
        // console.error('Erreur lors de l\'ajout de la formation:', error);
      }
    );
  }

  updateFormation(id: any, formationData: any) {
    this.formationService.putFormation(id, formationData).subscribe(
      res => {
        // console.log('Formation mise à jour avec succès');
        Swal.fire({
          icon: 'success',
          title: 'Formation mise à jour avec succès',
          showConfirmButton: false,
          timer: 1500
        })

      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise à jour de la formation',
          showConfirmButton: false,
          timer: 1500
        })
        // console.error('Erreur lors de la mise à jour de la formation:', error);
      }
    );
  }

  editFormation(formt: Formation) {
    this.selectedFormation = formt; // Sélectionner la formation pour la modification
    this.afficherForm = 'createForm'; // Afficher le formulaire de création/modification
    this.FormationForm.patchValue({
      titre: formt.titre,
      description: formt.description,
      domaine: formt.domaine._id, // Utilisez l'ID du domaine
      sessionCours: formt.sessionCours._id
    });
  }

  deleteFormation(id: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Formation supprimée avec succès',
            showConfirmButton: false,
            timer: 1500
          })
          // console.log('Formation supprimée avec succès');
          this.getFormations(); // Mettre à jour la liste des formations après la suppression
        },
        error => {
          
          console.error('Erreur lors de la suppression de la formation:', error);
        }
      );
    }
  }



//----------------------------------------------------------------------
//------------------------------User------------------------------------
//----------------------------------------------------------------------











// ----------------------------------------------------------------------
// ------------------------------Domaine---------------------------------
// ----------------------------------------------------------------------


saveOrUpdateDomaine() {
  if (this.DomaineForm.valid) {
    const DomaineData = {
      type: this.DomaineForm.value.type,

    };

    if (this.selectedDomaine) {
      // Si une formation est sélectionnée pour la modification
      this.updateDomaine(this.selectedDomaine._id, DomaineData);
      // this.closeForm(); // Fermer le formulaire après l'ajout
      // this.getDomaines();
    } else {
      // Sinon, ajouter une nouvelle formation
      this.addDomaine(DomaineData);

    }
  }
}

addDomaine(DomaineData: any) {
  this.domaineService.addDomaine(DomaineData).subscribe(
    res => {
      Swal.fire({
        icon: 'success',
        title: 'Domaine ajoutée avec succès',
        showConfirmButton: false,
        timer: 1500
      })
      // console.log('Domaine ajoutée avec succès');
      this.closeForm(); // Fermer le formulaire après l'ajout
      this.getDomaines();
          },
    error => {
      console.error('Erreur lors de l\'ajout de la Domaine:', error);
    }
  );
}

updateDomaine(id: any, DomaineData: any) {
  this.domaineService.putDomaine(id, DomaineData).subscribe(
    res => {
      Swal.fire({
        icon: 'success',
        title: 'Domaine mise à jour avec succès',
        showConfirmButton: false,
        timer: 1500
      })
      // console.log('Domaine mise à jour avec succès');
      this.closeForm(); // Fermer le formulaire après l'ajout
      this.getDomaines();

    },
    error => {
      console.error('Erreur lors de la mise à jour de la formation:', error);
    }
  );
}

editDomaine(dmn: Domaine) {
  this.selectedDomaine = dmn; // Sélectionner la formation pour la modification
  this.afficherForm = 'createForm'; // Afficher le formulaire de création/modification
  this.DomaineForm.patchValue({
    type: dmn.type,

  });
}

deleteDomaine(id: any) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
    this.domaineService.deleteDomaine(id).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'domaine supprimée avec succès',
          showConfirmButton: false,
          timer: 1500
        })
        // console.log('domaine supprimée avec succès');
        this.getDomaines();
      },
      error => {
        console.error('Erreur lors de la suppression du domaine:', error);
      }
    );
  }
}
 


// ----------------------------------------------------------------------
// ------------------------------statistique-----------------------------
// ----------------------------------------------------------------------


 
setYearOptions(): void {
  const currentYear = new Date().getFullYear();
  const startYear = 2020; // Modifier selon vos besoins
  for (let i = currentYear; i >= startYear; i--) {
    this.yearOptions.push(i);
  }
}

countApprenants(): void {
  this.authService.countApprenantPerDate(this.apprenantyear)
    .subscribe(response => {
      this.apprenantCount = response.count; // Utilisation de 'response.count' pour accéder à la propriété 'count'
    this.countFormateur();
    }, error => {
      console.error('Error counting apprenants:', error);
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    });
}


countAllApprenants(): void {
  this.authService.countAllApprenant()
    .subscribe(response => {
      this.AllApprenantCount = response.count; // Utilisation de 'response.count' pour accéder à la propriété 'count'
    }, error => {
      console.error('Error counting all apprenants:', error);
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    });
}

countFormateur(): void {
  this.authService.countFormateurPerDate(this.apprenantyear)
    .subscribe(response => {
      this.formateurCount = response.count; // Utilisation de 'response.count' pour accéder à la propriété 'count'
      this.drawPieChartPerYear();
    }, error => {
      console.error('Error counting formateur:', error);
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    });
}


countAllFormateur(): void {
  this.authService.countAllFormateur()
    .subscribe(response => {
      this.AllFormateurCount = response.count; // Utilisation de 'response.count' pour accéder à la propriété 'count'
    }, error => {
      console.error('Error counting formateurs:', error);
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    });
}



loadDataAndDrawChart(): void {
  // Charger toutes les données nécessaires
  this.countApprenants();
  this.countAllApprenants();
  this.countAllFormateur();
  this.countFormateur();

  // Dessiner le graphique une fois que toutes les données sont récupérées
  setTimeout(() => {
    this.drawPieChart();
  }, 500); // Attendre 500 ms pour s'assurer que les données sont prêtes
}

drawPieChart(): void {
  Chart.register(...registerables);

  const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
  if (ctx) {
    // Définir la taille du canvas
    ctx.width = 400;
    ctx.height = 400;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Nombre total d\'apprenants', 'Nombre total de formateurs'],
        datasets: [{
          data: [this.AllApprenantCount, this.AllFormateurCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)', // Couleur pour les apprenants
            'rgba(54, 162, 235, 0.7)', // Couleur pour les formateurs
          ],
        }]
      },
      options: {
        responsive: false, // Désactiver la réactivité
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  } else {
    console.error("Canvas element with id 'pieChart' not found.");
  }
}




// Dans la méthode drawPieChartPerYear(), utilisez la propriété this.pieChartPerYear
drawPieChartPerYear(): void {
  Chart.register(...registerables);

  const ctx = document.getElementById('pieChartPerYear') as HTMLCanvasElement;
  if (ctx) {
    ctx.width = 400;
    ctx.height = 400;

    // Vérifiez si un graphique existe déjà sur le canvas et détruisez-le si c'est le cas
    if (this.pieChartPerYear) {
      this.pieChartPerYear.destroy();
    }

    // Dessinez le nouveau graphique et stockez l'instance dans la propriété pieChartPerYear
    this.pieChartPerYear = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Apprenants', 'Formateurs'],
        datasets: [{
          data: [this.apprenantCount, this.formateurCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)', // Couleur pour les apprenants
            'rgba(54, 162, 235, 0.7)', // Couleur pour les formateurs
          ],
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  } else {
    console.error("Canvas element with id 'pieChartPerYear' not found.");
  }
}




loadDataAndDrawChartPerYear(): void {
  // Charger toutes les données nécessaires
  forkJoin([
    this.authService.countApprenantPerDate(this.apprenantyear),
    this.authService.countFormateurPerDate(this.apprenantyear)
  ]).subscribe(
    ([apprenantResponse, formateurResponse]) => {
      this.apprenantCount = apprenantResponse.count;
      this.formateurCount = formateurResponse.count;
      this.drawPieChartPerYear();
    },
    error => {
      console.error('Error counting apprenants and formateurs:', error);
      // Gérer l'erreur, par exemple afficher un message d'erreur à l'utilisateur
    }
  );
}




// ----------------------------------------------------------------------
// ------------------------------Formateur-------------------------------
// ----------------------------------------------------------------------


getFormateurs() {
  this.formateurService.getFormateur().subscribe(user => {
    this.formateurs = user;
    console.log("this.formateurs: " , this.formateurs);
  });
}

editUser(user: Formateur) {
  console.log('Utilisateur sélectionné :', user); // Vérifiez les données de l'utilisateur
  this.selectedFormateur = user;
  console.log('selectedFormateur :' , this.selectedFormateur)
  this.afficherForm = 'editformateurForm';
  this.formateurForm.patchValue({
      status: user.status,
      profil: user.profil,
      fichiers: user.fichiers

  });
}

updateUser(id: any, userData: any) {
console.log("Données envoyées au serveur :", userData); // Log des données envoyées au serveur
this.formateurService.updateFormateur(id, userData).subscribe(
  res => {
    Swal.fire({
      icon: 'success',
      title: 'Formateur mis à jour avec succès',
      showConfirmButton: false,
      timer: 1500
    })
    console.log('Réponse du serveur après la mise à jour Formateur :', res); // Log de la réponse du serveur
    // console.log('Utilisateur mis à jour avec succès');
    this.getFormateurs();
  },
  error => {
    console.error('Erreur lors de la mise à jour Formateur:', error);
  }
);
}

deleteUser(id: any) {
if (confirm('Êtes-vous sûr de vouloir supprimer ce Formateur ?')) {
  this.formateurService.deleteFormateur(id).subscribe(
    () => {
      Swal.fire({
        icon: 'success',
        title: 'Formateur supprimée avec succès',
        showConfirmButton: false,
        timer: 1500
      })
      // console.log('Utilisateur supprimée avec succès');
      this.getUsers(); // Mettre à jour la liste des formations après la suppression
    },
    error => {
      console.error('Erreur lors de la suppression du Formateur:', error);
    }
  );
}
} 


saveOrUpdateUser() {
  if (this.formateurForm.valid) {
      console.log('Données du formulaire :', this.formateurForm.value); // Vérifiez les données du formulaire
      const userData = {
          status: this.formateurForm.value.status,

      };

      if (this.selectedFormateur) {
          this.updateUser(this.selectedFormateur._id, userData);
          // this.closeForm();

      }
  }
}


getPdfUrl(pdfName: string): SafeResourceUrl {
  const url = `http://localhost:9090/pdf/${pdfName}`;
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

}
