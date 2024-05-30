import { Component, OnInit } from '@angular/core';
import { FileDownloadService } from '../file-download.service';
import { FormationService } from '../service/formation.service';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profil } from '../model/profil';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormateurService } from '../service/formateur.service';
import { Formateur } from '../model/formateur';


@Component({
  selector: 'app-formateurs',
  templateUrl: './formateurs.component.html',
  styleUrl: './formateurs.component.css'
})
export class FormateursComponent implements OnInit{
  message = "Une réponse par accord ou rejet sera envoyée par notre recruteur.";
  selectedFile: File | null = null;
  subject = '';
  text = '';
  responseMessage = '';
  form!: FormGroup;
  user!:Profil
  afficherPremierBloc: boolean = true;
  formateurId!: string // Déclarez la propriété formateurId et initialisez-la à null
  profilId!:any

  constructor(
    private formBuilder: FormBuilder,
    private router:Router,
    private service: AuthService,
    private formateurService: FormateurService,

    private formationsService: FormationService
  ) {}



  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      adresse: ['', [Validators.required, Validators.email]],
      motdepasse: ['', [Validators.required, Validators.minLength(6)]],
      image: ['', Validators.required],
    });


  }


  
  creerCompte() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nom', this.form.value.nom);
      formData.append('adresse', this.form.value.adresse);
      formData.append('motdepasse', this.form.value.motdepasse);
      formData.append('image', this.form.value.image);
  
      console.log('Selected image:', this.form.value.image.name);
  
      this.formateurService.createAcountFormateur(formData)
        .subscribe(
          (res: any) => {
            console.log('res:', res);

            this.formateurId = res.formateur._id;
            console.log('Nouveau formateur créé avec ID:', this.formateurId);
  


            // Masquer le premier bloc après la création du compte
            this.afficherPremierBloc = false;
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Email déjà existant',
              text: 'Veuillez utiliser un autre email.',
              showConfirmButton: true
            });
          }
        );
    }
  }
  
  

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.form.patchValue({ image: file });
    }
}

onFileSelectedAndAddPDF(event: any, formateurId: string): void {
  const files: FileList = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      console.log('Fichier sélectionné :', file.name);
      
      // Appeler la fonction pour télécharger les fichiers avec l'ID du formateur
      this.addPDF(formateurId, file);
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Aucun fichier est sélectionné',
      showConfirmButton: false,
      timer: 1500
    });
  }
}


addPDF(formateurId: string, file: File): void {
  if (file) {
    this.formateurService.addCVFormateur(formateurId, file).subscribe(
      (updatedFormation) => {
        Swal.fire({
          icon: 'success',
          title: this.message,
          showConfirmButton: false,
          timer: 1500
        });
        console.log('PDF ajouté avec succès à la formation:', updatedFormation);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de l\'ajout du PDF à la formation',
          showConfirmButton: false,
          timer: 1500
        });
        // console.error('Erreur lors de l\'ajout du PDF à la formation :', error);
      }
    );
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Aucun fichier sélectionné',
      showConfirmButton: false,
      timer: 1500
    });
    // console.warn('Aucun fichier sélectionné.');
  }
}



}