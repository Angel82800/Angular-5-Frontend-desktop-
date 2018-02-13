import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareButtonsModule } from 'ngx-sharebuttons';

// import main routing NgModule
import { routing } from './main-routing.module';

// import dev define component
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NotificationComponent } from './notification/notification.component';
import { OverViewComponent } from './overview/overview.component';
import { MainWallpaperComponent } from './wallpaper/wallpaper.component';
import { ProfileComponent } from './profile/profile.component';


import { MemberComponent } from './search/member/member.component';
import { WallpaperComponent } from './search/wallpaper/wallpaper.component';
import { UploadComponent } from './upload/upload.component';
import { CategoryComponent } from './category/category.component';
import { GroupComponent } from './group/group.component';

import { TemplateModule } from './template.module';

@NgModule({
    declarations: [
        MainComponent,
        HomeComponent,
        GalleryComponent,
        NotificationComponent,
        OverViewComponent,
        MainWallpaperComponent,
        WallpaperComponent,
        MemberComponent,
        UploadComponent,
        ProfileComponent,
        CategoryComponent,
        GroupComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        routing,
        TemplateModule,
        ShareButtonsModule.forRoot(),
    ],
    providers: [],
})

export class MainModule {}