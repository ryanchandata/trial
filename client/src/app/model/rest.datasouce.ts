import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey } from './survey.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { User } from './user.model';

const PROTOCOL = 'http';
const  PORT = 3500;

export interface IResponse {
  error: string | undefined | null;
  data: any;
}

@Injectable()
export class RestDataSource
{
  user: User;
  baseUrl: string;
  authToken: string;

  private httpOptions =
  {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };



  constructor(private http: HttpClient,
              private jwtService: JwtHelperService)
  {
    this.user = new User();
    // * Development
    // this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/api/`;

    // * Deployment
    this.baseUrl = `https://comp229-group-project-3c.herokuapp.com/api/`;
  }

  getSurveys(): Observable<IResponse>
  {
    return this.http.get<IResponse>(this.baseUrl + 'surveys');
  }

  getSurvey(id: string): Observable<IResponse>
  {
    return this.http.get<IResponse>(this.baseUrl + `surveys/${id}`);
  }

  addSurvey(survey: Survey): Observable<IResponse>
  {
    this.loadToken();
    return this.http.post<IResponse>(this.baseUrl + 'surveys/add', survey, this.httpOptions);
  }

  deleteSurvey(data: any): Observable<IResponse>
  {
    this.loadToken();
    return this.http.post<IResponse>(this.baseUrl + `surveys/delete`, data, this.httpOptions);
  }

  updateSurvey(data: any): Observable<IResponse>
  {
    this.loadToken();
    return this.http.post<IResponse>(this.baseUrl + `surveys/update/${data.survey._id}`, data, this.httpOptions);
  }

  takeSurvey(survey: Survey): Observable<IResponse>
  {
    return this.http.post<IResponse>(this.baseUrl + `surveys/take/${survey._id}`, survey);
  }

  // Authentication Section

  authenticate(user: User): Observable<any>
  {
    return this.http.post<any>(this.baseUrl + 'login', user, this.httpOptions);
  }

  storeUserData(token: any, user: User): void
  {
    // * 'bearer ' not needed for deploy on heroku
    // localStorage.setItem('id_token', 'Bearer ' + token);
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout(): Observable<any>
  {
    this.authToken = null;
    this.user = null;
    localStorage.clear();

    return this.http.get<any>(this.baseUrl + 'logout', this.httpOptions);
  }

  loggedIn(): boolean
  {
    return !this.jwtService.isTokenExpired(this.authToken);
  }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>( this.baseUrl + 'register', user, this.httpOptions);
  }

  updateUser(user: User): Observable<any> {
    this.loadToken();
    return this.http.post<any>( this.baseUrl + 'update', user, this.httpOptions);
  }

  // updates the headers with the bearer token
  private loadToken(): void
  {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', this.authToken);
  }
}
