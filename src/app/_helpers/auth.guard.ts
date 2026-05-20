import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private accountService: AccountService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const account = this.accountService.accountValue;

        // If logged in, allow access
        if (account) {
            // Only check roles if the route explicitly defines them
            const requiredRoles = route.data?.['roles'];
            if (requiredRoles?.length && !requiredRoles.includes(account.role)) {
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }

        // Not logged in → go to login page
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}