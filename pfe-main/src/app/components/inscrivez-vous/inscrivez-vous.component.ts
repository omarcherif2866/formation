import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Profil } from '../../model/profil';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscrivez-vous',
  templateUrl: './inscrivez-vous.component.html',
  styleUrls: ['./inscrivez-vous.component.css']
})
export class InscrivezVousComponent implements OnInit {

  form!: FormGroup;
  formLogin!: FormGroup;
  user!:Profil
  afficherForm: string = '';
  roles: string[] = ['apprenant', 'formateur'];

  constructor(private formBuilder: FormBuilder, private service: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nom: ['', Validators.required],
      adresse: ['', [Validators.required, Validators.email]],
      motdepasse: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      image: ['', Validators.required],
    });

    this.formLogin = this.formBuilder.group({
      adresse: ['', Validators.required],
      motdepasse: ['', Validators.required]
    });
  }

  afficherFormulaire(form: string) {
    this.afficherForm = form;
  }


  
  creerCompte() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('nom', this.form.value.nom);
      formData.append('adresse', this.form.value.adresse);
      formData.append('motdepasse', this.form.value.motdepasse);
      formData.append('role', this.form.value.role);
      formData.append('image', this.form.value.image); // Assurez-vous que form.value.image est bien un objet File
  
      console.log('Selected role:', this.form.value.role); // SweetAlert: Selected role
      console.log('Selected image:', this.form.value.image.name); // SweetAlert: Selected image
  
      this.service.createAcount(formData)
        .subscribe(
          res => {
            Swal.fire({
              icon: 'success',
              title: 'Inscription réussie',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              window.location.reload();
            });
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
  

  signin() {
    const t = {
      adresse: this.formLogin.value.adresse,
      motdepasse: this.formLogin.value.motdepasse,
    };

    this.service.signIn(t).subscribe(
      (data) => {
        this.user = data;
        localStorage.setItem('user_id', data._id); // Store user ID
        localStorage.setItem('user_email', data.adresse); // Store user email
        console.log('User ID:', data._id);
        console.log('User ID stored in localStorage:', localStorage.getItem('user_id'));
        console.log('User email stored in localStorage:', localStorage.getItem('user_email'));
        console.log('connexion réussit');
        this.service.setLoggedIn(true);
        Swal.fire({
          icon: 'success',
          title: 'Vous êtes connecté',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.reload();
        });
      },
      (error: any) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Connexion échouée',
          text: error.error.message,
          confirmButtonText: 'OK'
        });
      }
    );
  }




  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        this.form.patchValue({ image: file });
    }
}

forgetpassword(){
  this.router.navigate(["/forgetpassword"])

}

}
