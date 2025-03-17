import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8345'; // Cambia por la URL de tu backend

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.apiUrl}/auth/token`, payload);
  }

  // Método para guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token); // O usa sessionStorage si prefieres
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para eliminar el token (logout)
  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Retorna true si el token existe
  }


}
