import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { UserService } from '../core/service/user.service';
import { UserResponse } from '../core/models/user-response.model';

interface UserWithToggle extends UserResponse {
  showLogin: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  isTokenValid: boolean = false;
  users: UserWithToggle[] = [];

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(valid => {
      this.isTokenValid = valid;
      if (valid) {
        this.loadUsers();
      } else {
        this.users = [];
      }
    });
  }

  private loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.users = users.map(u => ({ ...u, showLogin: false }));
      },
      error: (err: any) => console.error('Erreur récupération utilisateurs', err)
    });
  }

  editUser(user: UserWithToggle): void {
    this.router.navigate(['/edit-user', user.id], { state: { user } });
  }

  confirmDelete(user: UserWithToggle): void {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer ${user.firstName} ${user.lastName} ?`);
    if (confirmed) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Erreur suppression utilisateur', err)
      });
    }
  }

  toggleLogin(user: UserWithToggle) {
    user.showLogin = !user.showLogin;
  }
}
