import { RouterModule, Routes, Params } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// import dev definitin component
import { SettingsComponent } from './settings.component';
import { Information } from './information/information.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EmailComponent } from './email/email.component';
import { GeneralComponent } from './general/general.component';
import { SocialComponent } from './social/social.component';

export const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', component: GeneralComponent },
            { path: 'info', component: Information },
            { path: 'change', component: ChangepasswordComponent },
			{ path: 'social', component: SocialComponent },
			{ path: 'email', component: EmailComponent }
        ],
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);