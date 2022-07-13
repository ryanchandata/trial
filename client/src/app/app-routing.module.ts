import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DisplayResultsComponent } from './survey-library/display-results/display-results.component';
import { EditSurveyComponent } from './survey-library/edit-survey/edit-survey.component';
import { SurveyManagementComponent } from './survey-library/survey-management/survey-management.component';
import { TakeSurveyComponent } from './survey-library/take-survey/take-survey.component';
import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './pages/error/error.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent, data: {title: '3C Surveys'}},
  {path: 'login', data: {title: 'Login'}, redirectTo: '/admin/login', pathMatch: 'full'},
  {path: 'register', data: {title: 'Register'}, redirectTo: '/admin/register', pathMatch: 'full'},
  {path: 'update', data: {title: 'Upadate User Info'}, redirectTo: '/admin/update', pathMatch: 'full'},

  {path: 'surveys/take/:id', component: TakeSurveyComponent, data: {title: 'Take Survey'}},
  {path: 'surveys', component: SurveyManagementComponent, data: {title: 'Survey Management'}, canActivate: [AuthGuard]},
  {path: 'surveys/edit/:id', component: EditSurveyComponent, data: {title: 'Edit Survey'}, canActivate: [AuthGuard]},
  {path: 'surveys/results/:id', component: DisplayResultsComponent, data: {title: 'Results'}, canActivate: [AuthGuard]},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'error', component: ErrorComponent, data: {title: 'Error'}},
  {path: '**', redirectTo: '/error', pathMatch: 'full'},
  // {path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
