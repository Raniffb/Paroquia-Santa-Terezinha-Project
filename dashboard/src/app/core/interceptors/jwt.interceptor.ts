import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'pst_admin_token';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
  } catch { /* SSR ou localStorage indisponível */ }
  return next(req);
};
