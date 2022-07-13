import { Injectable } from '@angular/core';
import { Survey } from './survey.model';
import { IResponse, RestDataSource } from './rest.datasouce';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Swal } from 'sweetalert2/dist/sweetalert2.js';

@Injectable()
export class SurveyRepository
{
  private surveys: Survey[] = [];

  constructor(
    private restDataSource: RestDataSource,
    private flashMessage: FlashMessagesService)
  {
    this.initializeSurveys();
  }

  getActiveSurveys(): Survey[]
  {
    return this.surveys.filter((survey) => this.isActive(survey));
  }

  getSurveys(): Survey[]
  {
    return this.surveys;
  }

  getSurvey(id: string): Survey
  {
    return this.surveys.find(s => id === s._id);
  }

  addSurvey(survey: Survey): void
  {
    this.restDataSource.addSurvey(survey).subscribe(data => {
      const addedSurvey = data.data as Survey;
      const error = data.error;

      if (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to create survey, please try again.',
          icon: 'error'
        });
         // this.flashMessage.show('Error: failed to create survey, please try again.', {cssClass: 'alert-danger', timeOut: 6000});
      } else if (addedSurvey) {
        this.initializeSurveys(); // reload surveys
        // this.router.navigateByUrl('/surveys/edit/' + addedSurvey._id);
      }
    });
  }

  deleteSurvey(surveyData: Survey, userID: string): void
  {
    const userSurveyData = {survey: surveyData, userID};
    this.restDataSource.deleteSurvey(userSurveyData).subscribe(data => {
      const error = data.error;

      if (error) {

        Swal.fire({
          title: 'Error',
          text: 'Failed to delete survey, please try again.',
          icon: 'error'
        });
       // this.flashMessage.show('Error: failed to delete survey, please try again.', {cssClass: 'alert-danger', timeOut: 6000});
      } else {
        this.initializeSurveys(); // reload surveys
      }
    });
  }

  updateSurvey(surveyData: Survey, userID: string): Observable<IResponse>
  {
    const data = {survey: surveyData, userID};
    return this.restDataSource.updateSurvey(data);
  }
  takeSurvey(survey: Survey): Observable<IResponse>
  {
    return this.restDataSource.takeSurvey(survey);
  }
  initializeSurveys(): void {
    this.restDataSource.getSurveys().subscribe(data => {
      this.surveys = data.data;
    });
  }

  isActive(survey: Survey): boolean {

    const activeDate = new Date(survey.dateActive).getTime();
    const expireDate = new Date(survey.dateExpire).getTime();

    if (activeDate <= Date.now() &&  Date.now() <= expireDate)
    {
      return true;
    } else {
      return false;
    }
  }

}
