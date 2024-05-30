import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPayPalModule } from 'ngx-paypal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { InscrivezVousComponent } from './components/inscrivez-vous/inscrivez-vous.component';
import { DomaineComponent } from './components/domaine/domaine.component';
import { ForumComponent } from './components/forum/forum.component';
import { ContactComponent } from './contact/contact.component';
import { FormateursComponent } from './formateurs/formateurs.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { FormationsComponent } from './components/formations/formations.component';
import { SessionComponent } from './components/session/session.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [
    AppComponent,
 NavbarComponent,
      HomeComponent,
      InscrivezVousComponent,
      DomaineComponent,
      ForumComponent,
      ContactComponent,
      FormateursComponent,
      AdminComponent,
      ProfileComponent,
      FormationsComponent,
      SessionComponent,
      ForgotPasswordComponent,
      ResetPasswordComponent,
     
      
  ],
  imports: [
    BrowserModule,
    CarouselModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    NgxPayPalModule,
    ReactiveFormsModule,
    HttpClientModule
     ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
