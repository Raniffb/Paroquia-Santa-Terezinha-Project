import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../admin/core/services/auth.service';

const TOKEN_KEY = 'pst_admin_token';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth   = inject(AuthService);

  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  } catch { /* SSR ou localStorage indisponível */ }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 no /auth/login significa credenciais erradas, não sessão expirada —
      // deixa o AuthService tratar isso e não redireciona.
      if (err.status === 401 && !req.url.endsWith('/auth/login')) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { sessao: 'expirada' } });
      }
      return throwError(() => err);
    })
  );
};
