import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountService } from '../_services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const account = this.accountService.accountValue;
        const isLoggedIn = account && account.jwtToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        // ✅ Add token ONLY for API requests AND if user is logged in
        if (isLoggedIn && isApiUrl && !this.isPublicEndpoint(request.url)) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
            });
        }

        return next.handle(request);
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