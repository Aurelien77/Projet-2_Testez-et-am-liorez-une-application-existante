import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { Login } from '../../core/models/Login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  loginSuccess = false;
  errorMessage: string = ''; 
  token: string = ''; //Variable pour stoker le token

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.loginSuccess = false;
    this.token = ''; // Initialisation vers un toekn vide

    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Login = {
      login: this.form['login'].value,
      password: this.form['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (token: string) => {
        this.loginSuccess = true;
        this.token = token; 
        localStorage.setItem('token', token);
        this.router.navigate(['']);
  /*    alert('Token reçu :\n' + token); */
          
      
      },
      error: (err) => {
      
  if (err.status === 0) {
    this.errorMessage = "Le serveur est indisponible. Vérifiez qu'il est démarré.";
  }

  
  else if (err.status === 401) {
    this.errorMessage = "Identifiants incorrects. Veuillez réessayer.";
  }

 
  else if (err.status === 404) {
    this.errorMessage = "Le service d'authentification est introuvable (404).";
  }


  else if (err.status === 500) {
    this.errorMessage = "Mauvais login ou mots de passe";
  }

  
  else {
    this.errorMessage = "Une erreur est survenue : " + err.message;
  }

  this.loginSuccess = false;
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
    this.errorMessage = '';
    this.loginSuccess = false;
    this.token = ''; // reset du token suite au bouton Réinitialiser.
  }
}
