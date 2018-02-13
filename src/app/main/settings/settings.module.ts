import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// import main routing NgModule
import { routing } from './routing';

// import dev define component
import { SettingsComponent } from './settings.component';
import { Information } from './information/information.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EmailComponent } from './email/email.component';
import { GeneralComponent } from './general/general.component';
import { SocialComponent } from './social/social.component';

@NgModule({
    declarations: [
        SettingsComponent,
        Information,
        ChangepasswordComponent,
        EmailComponent,
        GeneralComponent,
        SocialComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        routing
    ],
    providers: [],
})

export class SettingsModule {}