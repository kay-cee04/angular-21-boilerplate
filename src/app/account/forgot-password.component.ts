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
    showSuccessPopup = false;
    errorMessage = '';
    showErrorPopup = false;

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

    showSuccessAlert(message: string) {
        this.successMessage = message;
        this.showSuccessPopup = true;
        
        setTimeout(() => {
            this.showSuccessPopup = false;
        }, 5000);
    }

    showErrorAlert(message: string) {
        this.errorMessage = message;
        this.showErrorPopup = true;
        
        setTimeout(() => {
            this.showErrorPopup = false;
        }, 5000);
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        this.accountService.forgotPassword(this.f['email'].value)
            .pipe(first())
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    const message = `📧 Password reset instructions have been sent to ${this.f['email'].value}. Please check your email (including spam folder).`;
                    this.showSuccessAlert(message);
                    this.alertService.success(message, { keepAfterRouteChange: true, autoClose: true });
                    this.form.reset();
                    this.submitted = false;
                },
                error: (error) => {
                    const message = error || 'An error occurred. Please try again later.';
                    this.showErrorAlert(message);
                    this.alertService.error(message);
                }
            });
    }
}