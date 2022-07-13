import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { EmailValidateDirective } from './email-validator';


const routing = RouterModule.forChild([
  { path: 'login', component: LoginComponent, data: {title: 'Login'}},
  { path: 'register', component: RegisterComponent, data: {title: 'Register'}},
  { path: 'update', component: UpdateUserComponent,  data: {title: 'Update Account'}, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'login' },
]);

@NgModule({
  imports: [CommonModule, FormsModule, routing],
  providers: [AuthGuard],
  declarations: [LoginComponent, RegisterComponent, UpdateUserComponent, EmailValidateDirective],
  exports: [EmailValidateDirective]
})
export class AdminModule {}
