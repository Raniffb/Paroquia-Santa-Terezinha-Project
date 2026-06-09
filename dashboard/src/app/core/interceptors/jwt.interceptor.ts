import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../admin/core/services/auth.service';
import { environment } from '../../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth   = inject(AuthService);

  // Envia cookies HttpOnly automaticamente em requisições para a própria API.
  // withCredentials: true é obrigatório para o browser incluir cookies cross-origin.
  if (req.url.startsWith(environment.apiUrl)) {
    req = req.clone({ withCredentials: true });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 em /auth/login = credenciais erradas — não redireciona.
      // 401 em /auth/logout = improvável (é @Public), mas ignora da mesma forma.
      const isAuthEndpoint =
        req.url.endsWith('/auth/login') || req.url.endsWith('/auth/logout');

      if (err.status === 401 && !isAuthEndpoint) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { sessao: 'expirada' } });
      }
      return throwError(() => err);
    })
  );
};
