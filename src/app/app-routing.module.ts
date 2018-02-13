import { RouterModule, Routes, Params } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
// import dev Define Component
import { CommunityComponent } from './community/community.component';
import { PolicyComponent } from './policy/policy.component';
import { TermComponent } from './term/term.component';
import { ContactComponent } from './contact/contact.component';
import { AuthComponent } from './auth/auth.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ErrorComponent } from './error/error.component';
import { IerrorComponent } from './ierror/ierror.component';

// import authGuard Service
import { AuthGuard } from './provider/auth.guard';

// Definition Routing
export const routes: Routes = [
    // Landing page
    { path: 'index', component: AuthComponent },
    { path: 'error', component: ErrorComponent },
    // Main page
    { path: 'cms', component: CommunityComponent} ,
    { path: 'contact', component: ContactComponent },
    { path: 'term', component: TermComponent },
    { path: 'changepassword/:token', component: ForgotComponent },
    { path: 'policy', component: PolicyComponent } ,
    { path: '**', component: ErrorComponent },
    { path: '500', component: IerrorComponent }

];

// export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);