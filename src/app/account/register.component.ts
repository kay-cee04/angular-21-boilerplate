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
    errorMessage = '';

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

    clearMessages() {
        setTimeout(() => {
            this.successMessage = '';
            this.errorMessage = '';
        }, 5000);
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        this.successMessage = '';
        this.errorMessage = '';

        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    const email = this.form.value.email;
                    this.successMessage = `✅ Registration successful! A verification email has been sent to ${email}. Please check your inbox and click the verification link to activate your account.`;
                    this.clearMessages();
                    
                    // Reset form
                    this.form.reset();
                    this.submitted = false;
                    this.submitting = false;
                    
                    // Redirect after 5 seconds
                    setTimeout(() => {
                        this.router.navigate(['/account/login']);
                    }, 5000);
                },
                error: error => {
                    this.errorMessage = error || 'Registration failed. Please try again.';
                    this.clearMessages();
                    this.submitting = false;
                }
            });
    }
}