import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarreComponent } from './nav-barre/nav-barre.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavBarreComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}

/* Injecte dans la class root  */

/* Composant principal ou injecter les autres composants */