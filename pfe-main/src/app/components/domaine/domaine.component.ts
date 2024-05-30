import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { DomaineService } from '../../service/domaine.service';
import { Formation } from '../../model/formation';
import { Router } from '@angular/router';
import { FormationService } from '../../service/formation.service';
import { AuthService } from '../../service/auth.service';
import { Session } from '../../model/session';
import { SessionService } from '../../service/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-domaine',
  templateUrl: './domaine.component.html',
  styleUrls: ['./domaine.component.css']
})
export class DomaineComponent {
  public payPalConfig?: IPayPalConfig;
  public showSuccess: boolean = false;
  public showPayPal: boolean = false; // Variable pour afficher/masquer le bloc PayPal
  domaineId!: any;
  formations: Formation[] = [];
  sessions: Session[] = [];
  selectedFile: File | null = null;
  isFormateur = false;
  authenticated = false;
  formationIdToRedirect: string | null = null; // Propriété pour stocker l'ID de formation
  selectedSession: Session | null = null;

  constructor(private sessionService: SessionService,private authService: AuthService, private route: ActivatedRoute, private domaineService: DomaineService, private formationService: FormationService, private router: Router) { }

  ngOnInit(): void {
    this.initConfig();
    this.route.params.subscribe(params => {
      this.domaineId = params['id'];
      this.getFormationsByDomaine(this.domaineId);
    });

    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.authenticated = loggedIn;
      console.log('Utilisateur connecté ?', loggedIn);

      if (loggedIn) {
        const userRole = localStorage.getItem('userRole');
        this.isFormateur = userRole === 'formateur';
      } else {
        this.isFormateur = false;
      }
    });

    this.getAllSession();
  }

  getFormationsByDomaine(domaineId: any): void {
    this.domaineService.getCoursByDomaine(domaineId).subscribe(
      formations => {
        this.formations = formations.map((formation: any) => {
          return {
            _id: formation._id,
            titre: formation.titre,
            description: formation.description,
            contenu: formation.contenu || [],
            apprenants: formation.apprenants || [],
            domaine: formation.domaine || null,
            sessionCours: formation.sessionCours || []
          };
        });
        console.log('formation recuperé par le domaine :', this.formations);
      },
      error => {
        console.error('Erreur lors de la récupération des formations :', error);
      }
    );
  }

  onFileSelectedAndAddPDF(event: any, formationId: string): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Fichier sélectionné :', this.selectedFile.name);
      this.addPDF(formationId);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Aucun fichier est séléctionné',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  addPDF(formationId: string): void {
    if (this.selectedFile) {
      this.formationService.addContenuFormation(formationId, this.selectedFile).subscribe(
        (updatedFormation) => {
          Swal.fire({
            icon: 'success',
            title: 'PDF ajouté avec succès à la formation',
            showConfirmButton: false,
            timer: 1500
          })
          // console.log('PDF ajouté avec succès à la formation:', updatedFormation);
          this.selectedFile = null;
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de l\'ajout du PDF à la formation',
            showConfirmButton: false,
            timer: 1500
          })
          // console.error('Erreur lors de l\'ajout du PDF à la formation :', error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Aucun fichier sélectionné',
        showConfirmButton: false,
        timer: 1500
      })
      // console.warn('Aucun fichier sélectionné.');
    }
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data: any, actions: any) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
        if (this.formationIdToRedirect) {
          this.router.navigate(['/Formations', this.formationIdToRedirect]); // Redirection vers la page de formation après le paiement
        }
      },
      
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  showPayPalBlock(): void {
    this.showPayPal = true;
  }

  redirectToFormation(formationId: string): void {
    this.formationIdToRedirect = formationId; // Stocker l'ID de formation
    this.router.navigate(['/Formations', formationId]);
  }
  
  getAllSession(): void {
    this.sessionService.getAllSession()
      .subscribe(
        (sessions: Session[]) => {
          this.sessions = sessions;
        },
        (error) => {
          console.error('Erreur lors de la récupération des sessions:', error);
          // Gérer l'erreur selon vos besoins
        }
      );
  }

  getFormationsBySession(sessionId: any): void {
    this.formationService.getCoursBySession(sessionId).subscribe(
      (formations: Formation[]) => {
        this.formations = formations;
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations:', error);
      }
    );
  }

  onSelectSession(session: Session): void {
    this.selectedSession = session;
    this.getFormationsBySession(session._id); // Appel à la fonction pour récupérer les formations
  }
  
}
