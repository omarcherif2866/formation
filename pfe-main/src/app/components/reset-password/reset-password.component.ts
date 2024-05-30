import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  form!: FormGroup;
  userId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];

    this.form = this.formBuilder.group({
      motdepasse: ['', [Validators.required]],
    });
  }



  onResetPassword() {
    if (this.form.invalid) {
      return;
    }

    const { motdepasse } = this.form.value;



    this.authService.resetPassword(this.userId, motdepasse).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Mot de passe mis à jour avec succès.',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/Inscrivez-vous']);
      },
      error => {
        console.error(error);
        if (error.status === 400) {
          console.log('Invalid token or password mismatch.');
        } else {
          console.log('Internal server error.');
        }
      }
    );
  }
}