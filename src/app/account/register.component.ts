import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'register.component.html', standalone: false })
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    submitting = false;
    submitted = false;
    successMessage = '';
    showSuccessPopup = false;
    errorMessage = '';
    showErrorPopup = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validators: [MustMatch('password', 'confirmPassword')]
        });
    }

    get f() { return this.form.controls; }

    showSuccessAlert(message: string) {
        this.successMessage = message;
        this.showSuccessPopup = true;
        
        // Auto fade after 5 seconds
        setTimeout(() => {
            this.showSuccessPopup = false;
        }, 5000);
    }

    showErrorAlert(message: string) {
        this.errorMessage = message;
        this.showErrorPopup = true;
        
        // Auto fade after 5 seconds
        setTimeout(() => {
            this.showErrorPopup = false;
        }, 5000);
    }

    hideSuccessPopup() {
        this.showSuccessPopup = false;
    }

    hideErrorPopup() {
        this.showErrorPopup = false;
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    const email = this.form.value.email;
                    const message = `✅ Registration successful! A verification email has been sent to ${email}. Please check your inbox and click the verification link to activate your account.`;
                    
                    // Show success popup
                    this.showSuccessAlert(message);
                    
                    // Also show alert service message
                    this.alertService.success(message, { keepAfterRouteChange: true, autoClose: true });
                    
                    // Reset form
                    this.form.reset();
                    this.submitted = false;
                    this.submitting = false;
                    
                    // Optional: Redirect to login after 5 seconds
                    setTimeout(() => {
                        this.router.navigate(['/account/login']);
                    }, 5000);
                },
                error: error => {
                    this.showErrorAlert(error || 'Registration failed. Please try again.');
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}