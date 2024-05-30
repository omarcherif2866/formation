import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InscrivezVousComponent } from './components/inscrivez-vous/inscrivez-vous.component';
import { DomaineComponent } from './components/domaine/domaine.component';
import { ForumComponent } from './components/forum/forum.component';
import { ContactComponent } from './contact/contact.component';
import { FormateursComponent } from './formateurs/formateurs.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormationsComponent } from './components/formations/formations.component';
import { SessionComponent } from './components/session/session.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


const routes: Routes = [
{ path :"Acceuil", component :HomeComponent},
{ path :"forgetpassword", component :ForgotPasswordComponent},
{ path :"resetPassword/:id", component :ResetPasswordComponent},
{ path :"Inscrivez-vous", component :InscrivezVousComponent},
{ path :"admin", component :AdminComponent},
{ path :"profil/:id", component :ProfileComponent},
{ path :"Domaines/:id", component :DomaineComponent},
{ path :"Formations/:id", component :FormationsComponent},
{ path :"session/:id", component :SessionComponent},
{ path :"Discussion", component :ForumComponent}, 
{ path: "formateurs/:id" , component : FormateursComponent},
{ path: "Administrateur" , component :AdminComponent},
{ path: ' ', redirectTo: '/Acceuil', pathMatch: 'full' }, // Rediriger vers le composant Home par défaut
{ path: "contact" , component : ContactComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
