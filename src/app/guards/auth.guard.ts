import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyectamos el servicio de autenticación
  const router = inject(Router); // Inyectamos el router

  if (authService.isAuthenticated()) {
    return true; // Permite el acceso si está autenticado
  } else {
    // Redirige al login si no está autenticado
    router.navigate(['/']);
    return false;
  }
};
