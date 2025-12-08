import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/service/user.service';
import { UserResponse } from '../core/models/user-response.model';
import { UpdateUser } from '../core/models/update-user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId: number = 0;
  user: UpdateUser = {
    firstName: '',
    lastName: '',
    login: '',
    password: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
  }

  private loadUser(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user: UserResponse) => {
        this.user = {
          firstName: user.firstName,
          lastName: user.lastName,
          login: user.login,
          password: '' // Ne pas pré-remplir le mot de passe
        };
      },
      error: (err: any) => {
        console.error('Erreur chargement utilisateur', err);
        this.errorMessage = 'Impossible de charger les données de l\'utilisateur';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Si le mot de passe est vide, ne pas l'envoyer
    const updateData: UpdateUser = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      login: this.user.login
    };

    if (this.user.password && this.user.password.trim() !== '') {
      updateData.password = this.user.password;
    }

    this.userService.updateUser(this.userId, updateData).subscribe({
      next: () => {
        this.successMessage = 'Utilisateur modifié avec succès !';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (err: any) => {
        console.error('Erreur modification utilisateur', err);
        this.errorMessage = err.error?.error || 'Erreur lors de la modification';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']);
  }
}