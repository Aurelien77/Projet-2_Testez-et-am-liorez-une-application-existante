import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { EditUserComponent } from './edit-user/edit-user.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'edit-user/:id',
    loadComponent: () => import('./edit-user/edit-user.component').then(m => m.EditUserComponent)
  },
];
