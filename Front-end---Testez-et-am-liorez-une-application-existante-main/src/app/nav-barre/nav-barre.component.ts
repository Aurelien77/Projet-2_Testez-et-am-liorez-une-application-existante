import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/service/auth.service';

@Component({
  selector: 'app-nav-barre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-barre.component.html',
  styleUrls: ['./nav-barre.component.css']
})
export class NavBarreComponent implements OnInit {

  isTokenValid = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // S’abonner aux changements de connexion
    this.authService.loggedIn$.subscribe(valid => this.isTokenValid = valid);
  }

  // Déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // revenir à home
  }

  //  Navigation vers login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  //  Navigation vers register
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

}
