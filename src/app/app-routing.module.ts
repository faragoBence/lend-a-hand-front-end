import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {LoginGuard} from './login.guard';
import {AdminGuard} from './admin.guard';
import {MainPageComponent} from './main-page/main-page.component';
import {SingleAdComponent} from './single-ad/single-ad.component';
import {CategoriesComponent} from './categories/categories.component';
import {AdsComponent} from './ads/ads.component';
import {VerificationComponent} from './verification/verification.component';
import {CreateAdComponent} from './create-ad/create-ad.component';
import {RatingsComponent} from './ratings/ratings.component';
import {AdsByAdvertiserComponent} from './ads-by-advertiser/ads-by-advertiser.component';
import {ApplicationsComponent} from './applications/applications.component';
import {MessagesComponent} from './messages/messages.component';
import {RateComponent} from './rate/rate.component';
import {UsersComponent} from './users/users.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {ReportsComponent} from './reports/reports.component';
import {ReportComponent} from './report/report.component';
import {PaypalComponent} from './paypal/paypal.component';
import {RatingGuard} from './rating.guard';


const routes: Routes = [
        {path: '', redirectTo: '/categories', pathMatch: 'full'},
    {path: 'report', component: ReportComponent},
        {path: 'reports', component: ReportsComponent},
        {path: 'login', component: LoginComponent},
        {path: 'ads', component: AdsComponent},
        {path: 'users', component: UsersComponent, canActivate: [AdminGuard]},
        {path: 'register', component: RegisterComponent},
        {path: 'main', component: MainPageComponent},
        {path: 'ad', component: SingleAdComponent},
        {path: 'createAd', component: CreateAdComponent},
        {path: 'categories', component: CategoriesComponent},
    {path: 'categories-for-user', component: CategoriesComponent, canActivate: [LoginGuard]},
        {path: 'profile', component: ProfileComponent, canActivate: [LoginGuard]},
        {path: 'verification', component: VerificationComponent},
        {path: 'ratings', component: RatingsComponent},
        {path: 'adsByAdvertiser', component: AdsByAdvertiserComponent, canActivate: [LoginGuard]},
        {path: 'applications', component: ApplicationsComponent},
        {path: 'messages', component: MessagesComponent, canActivate: [LoginGuard]},
    {path: 'rate', component: RateComponent, canActivate: [RatingGuard]},
    {path: 'notifications', component: NotificationsComponent, canActivate: [LoginGuard]},
    {path: 'payment', component: PaypalComponent}
    ]
;

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {


}
