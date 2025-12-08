import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/service/auth.service'; // ← ton service

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isTokenValid: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //  S’abonner aux changements de connexion
    this.authService.loggedIn$.subscribe(valid => this.isTokenValid = valid);
  }

}
