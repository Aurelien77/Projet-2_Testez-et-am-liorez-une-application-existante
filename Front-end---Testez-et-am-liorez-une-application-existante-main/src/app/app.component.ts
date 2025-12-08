import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarreComponent } from './nav-barre/nav-barre.component';

@Component({
  selector: 'app-root',
  standalone: true,
/*   <!-- ajout du routage des pages --> */
  imports: [
    RouterOutlet,
    NavBarreComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
