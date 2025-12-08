import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-barre',
  templateUrl: './nav-barre.component.html',
  styleUrls: ['./nav-barre.component.css']
})
export class NavBarreComponent {

  constructor(private router: Router) { }

  // Navigue vers la page Register
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Navigue vers la page Login
  goToLogin() {
    this.router.navigate(['/login']);
  }

}
