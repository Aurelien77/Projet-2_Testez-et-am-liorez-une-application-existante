import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Register } from '../../core/models/Register';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [CommonModule, MaterialModule],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  errorMessage: string = ''; // ← ajouter pour gérer l'erreur

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.registerForm.controls;
  }

  private router = inject(Router);

onSubmit(): void {
  this.submitted = true;
  this.errorMessage = ''; 

  if (this.registerForm.invalid) return;

  const registerUser: Register = {
    firstName: this.registerForm.get('firstName')?.value,
    lastName: this.registerForm.get('lastName')?.value,
    login: this.registerForm.get('login')?.value,
    password: this.registerForm.get('password')?.value
  };

  this.userService.register(registerUser)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response: any) => {
      
        if (response.message) {
          this.errorMessage = '';
          this.router.navigate(['/login']); 
        }
      },
      error: (err) => {
      
        this.errorMessage = err.error?.error || 'Une erreur est survenue';
      }
    });
}


  onReset(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.registerForm.reset();
  }
}
