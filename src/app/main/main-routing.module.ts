import { RouterModule, Routes, Params } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

// import dev definitin component
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { NotificationComponent } from './notification/notification.component';
import { OverViewComponent } from './overview/overview.component';
import { MainWallpaperComponent } from './wallpaper/wallpaper.component';
import { UploadComponent } from './upload/upload.component';
import { ProfileComponent } from './profile/profile.component';
import { CategoryComponent } from './category/category.component';

import { MemberComponent } from './search/member/member.component';
import { WallpaperComponent } from './search/wallpaper/wallpaper.component';
import { GroupComponent } from './group/group.component';
import { ErrorComponent } from '../error/error.component';
import { IerrorComponent } from '../ierror/ierror.component';

// import authguard service
import { AuthGuard } from '../provider/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'profile/:username', component: ProfileComponent },
            { path: 'gallery', component: GalleryComponent },
            { path: 'notification', component: NotificationComponent },
            { path: 'overview', component: OverViewComponent },
            { path: 'search-member', component: MemberComponent },
            { path: 'search/:tag', component: WallpaperComponent },
            // { path: 'gallery/wallpaper', component: MainWallpaperComponent },
            { path: 'upload', component: UploadComponent },
            { path: 'wallpaper/:img_id', component: MainWallpaperComponent },
            { path: '404', component: ErrorComponent },
            { path: '500', component: IerrorComponent },

            { path: 'gallery/:category', component: CategoryComponent },
            { path: 'group/:name', component: GroupComponent },
            { 
                path: 'settings',
                loadChildren: 'app/main/settings/settings.module#SettingsModule'
            }
        ],
        canActivate: [AuthGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);