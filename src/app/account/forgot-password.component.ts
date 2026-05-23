import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'forgot-password.component.html', standalone: false })
export class ForgotPasswordComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    successMessage = '';
    errorMessage = '';

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        this.successMessage = '';
        this.errorMessage = '';

        // Stop if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        this.accountService.forgotPassword(this.f['email'].value)
            .pipe(first())
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    // Show success message
                    this.successMessage = `📧 Password reset instructions have been sent to ${this.f['email'].value}. Please check your email (including spam folder) and follow the link to reset your password.`;
                    
                    // Also show alert service message
                    this.alertService.success(this.successMessage, { keepAfterRouteChange: true, autoClose: false });
                    
                    // Reset form
                    this.form.reset();
                    this.submitted = false;
                },
                error: (error) => {
                    // Show error message
                    this.errorMessage = error || 'An error occurred. Please try again later.';
                    this.alertService.error(this.errorMessage);
                }
            });
    }
}