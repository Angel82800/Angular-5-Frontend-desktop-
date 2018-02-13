import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainHeaderComponent } from './header/header.component';
import { MainFooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [
        MainHeaderComponent,
        MainFooterComponent
    ],
    imports: [FormsModule, CommonModule, RouterModule],
    exports: [
    	CommonModule,
    	MainHeaderComponent,
    	MainFooterComponent
    ],
})

export class TemplateModule {}