import { AuthService } from './auth.service';
import { NgModule } from '@angular/core';
import { SurveyRepository } from './survey.repository';
import { HttpClientModule } from '@angular/common/http';
import { RestDataSource } from './rest.datasouce';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    SurveyRepository,
    RestDataSource,
    AuthService
  ]
})
export class ModelModule
{

}
