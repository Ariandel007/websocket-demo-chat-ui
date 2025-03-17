import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/chat']);
    }
  }


  login() {
    this.authService.login(this.username, this.password).subscribe(
      {
        next: (response) => {
          console.log("response", response);
          // Guardar el token en el navegador
        if (response.token) {
          this.authService.saveToken(response.token);
          console.log('Token guardado en localStorage.');

          // Redirigir al chat
          this.router.navigate(['/chat']);
        }
        },
        error: (error) => {
          console.log("error", error);
        },
        complete: () => {
          console.log("complete");
        }
      }
    );
  }


}
