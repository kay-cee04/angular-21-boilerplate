import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    { 
        path: 'profile', 
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'account', 
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule) 
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }