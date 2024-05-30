import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      adresse: ['', [Validators.required, Validators.email]],
    });
  }

  onForgotPassword() {
    if (this.form.invalid) {
      return;
    }

    const adresse = this.form.value.adresse;

    this.authService.forget(adresse).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Email de réinitialisation de mot de passe envoyé avec succès',
          showConfirmButton: false,
          timer: 1500
        })
      },
      (error) => {
        console.error(error);
        if (error.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Utilisateur non trouvé',
            showConfirmButton: false,
            timer: 1500
          })
        } else if (error.status === 500) {
          console.log('Internal server error');
        } else {
          console.log('Unknown error occurred');
        }
      }
    );
  }
}