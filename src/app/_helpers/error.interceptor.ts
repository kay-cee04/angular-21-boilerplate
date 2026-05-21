import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // ✅ Only logout if user was logged in and got 401/403
            if ([401, 403].includes(err.status) && this.accountService.accountValue) {
                // Check if this is a public endpoint - don't logout
                const isPublicEndpoint = this.isPublicEndpoint(request.url);
                if (!isPublicEndpoint) {
                    this.accountService.logout();
                }
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            return throwError(() => error);
        }));
    }

    private isPublicEndpoint(url: string): boolean {
        const publicEndpoints = [
            '/accounts/register',
            '/accounts/authenticate',
            '/accounts/refresh-token',
            '/accounts/verify-email',
            '/accounts/forgot-password',
            '/accounts/validate-reset-token',
            '/accounts/reset-password'
        ];
        return publicEndpoints.some(endpoint => url.includes(endpoint));
    }
}
