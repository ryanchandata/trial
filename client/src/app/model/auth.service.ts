import { User } from './user.model';
import { RestDataSource } from './rest.datasouce';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService
{
  user: User;

  constructor(private datasource: RestDataSource)
  {
    this.user =  new User();
  }

  authenticate(user: User): Observable<any>
  {
    return this.datasource.authenticate(user);
  }

  storeUserDate(token: any, user: User): void
  {
    this.datasource.storeUserData(token, user);
  }

  get authenticated(): boolean
  {
    return this.datasource.loggedIn();
  }

  logout(): Observable<any>
  {
    return this.datasource.logout();
  }

  registerUser(user: User): Observable<any>
  {
    return this.datasource.registerUser(user);
  }

  updateUser(user: User): Observable<any>
  {
    return this.datasource.updateUser(user);
  }

}



