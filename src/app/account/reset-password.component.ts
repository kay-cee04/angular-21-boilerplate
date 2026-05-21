import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

enum TokenStatus {
    Validating,
    Valid,
    Invalid
}

@Component({ templateUrl: 'reset-password.component.html', standalone: false })
export class ResetPasswordComponent implements OnInit {
    TokenStatus = TokenStatus;
    tokenStatus = TokenStatus.Validating;
    token!: string;
    form!: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // Get token from URL query params
        this.token = this.route.snapshot.queryParams['token'];
        
        console.log('Token from URL:', this.token);

        if (!this.token) {
            this.tokenStatus = TokenStatus.Invalid;
            this.alertService.error('No reset token provided');
            return;
        }

        // Validate the token
        this.accountService.validateResetToken(this.token)
            .pipe(first())
            .subscribe({
                next: () => {
                    console.log('Token is valid');
                    this.tokenStatus = TokenStatus.Valid;
                    
                    // Initialize form after token is validated
                    this.form = this.formBuilder.group({
                        password: ['', [Validators.required, Validators.minLength(6)]],
                        confirmPassword: ['', Validators.required]
                    }, {
                        validators: [MustMatch('password', 'confirmPassword')]
                    });
                },
                error: (error) => {
                    console.error('Token validation failed:', error);
                    this.tokenStatus = TokenStatus.Invalid;
                    this.alertService.error(error);
                }
            });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.resetPassword(this.token, this.f['password'].value, this.f['confirmPassword'].value)
            .pipe(first())
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['/account/login']);
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }
}