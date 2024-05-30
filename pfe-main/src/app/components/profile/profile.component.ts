// profile.component.ts

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profil } from '../../model/profil';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  @Input() fullWidthMode = false;
  idUser: any;

  imageUrl: string | ArrayBuffer | null = null;
  selectedFileName: string = '';

  user: Profil = {} as Profil;
  ProfileForm!: FormGroup;
  errorMessage: string = '';

  submitted = false;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.getUserById();
  }

  initProfileForm(): void {
    this.ProfileForm = this.formBuilder.group({
      nom: ['', Validators.required],
      adresse: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
      console.log(file.name, file.type, file.size);
    } else {
      console.log("No file selected");
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.ProfileForm.invalid) {
      return;
    }

    const id = localStorage.getItem('user_id');
    if (id !== null) {
      const formData = new FormData();
      formData.append('nom', this.ProfileForm.value.nom);
      formData.append('adresse', this.ProfileForm.value.adresse);

      const fileInput = this.fileInput.nativeElement;
      if (fileInput.files && fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }

      this.authService.updateUserProfile(id, formData).subscribe(
        (updatedUser) => {
          if (updatedUser) {
            this.user = updatedUser;
            this.imageUrl = this.getProfileImageUrl(updatedUser.image);
            Swal.fire({
              icon: 'success',
              title: 'Profil mis à jour avec succès',
              showConfirmButton: false,
              timer: 1500
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Connexion échouée',
              text: 'Les données sont incorrectes.',
              confirmButtonText: 'OK'
            });
          }
        },
        (error) => {
          console.error('Error updating user profile:', error);
        }
      );
    } else {
      console.error("ID not found in localStorage.");
    }
  }

  

  getUserById(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.authService.getUserProfile(userId).subscribe(
        (user: any) => {
          if (user) {
            this.user = user;
            this.ProfileForm.patchValue({
              nom: user.nom,
              adresse: user.adresse,
              // image: user.image
            });
            this.imageUrl = this.getProfileImageUrl(user.image);
          }
        },
        (error) => {
          console.error('Error fetching user profile:', error);
          this.errorMessage = 'Failed to fetch user profile';
        }
      );
    } else {
      console.error('User ID not found in localStorage.');
      this.errorMessage = 'User ID not found';
    }
  }

  getProfileImageUrl(imageName: string): string {
    return `http://localhost:9090/img/${imageName}`;
  }
}
