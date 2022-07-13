import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModelModule } from '../model/model.module';
import { CounterDirective } from './counter.directive';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionFormComponent } from './question-form/question-form.component';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { SurveyManagementComponent } from './survey-management/survey-management.component';
import { RouterModule } from '@angular/router';
import { TakeSurveyComponent } from './take-survey/take-survey.component';
import { DisplayResultsComponent } from './display-results/display-results.component';



@NgModule({
  imports: [
    ModelModule,
    BrowserModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    SurveyListComponent,
    CounterDirective,
    QuestionsComponent,
    QuestionFormComponent,
    EditSurveyComponent,
    SurveyManagementComponent,
    TakeSurveyComponent,
    DisplayResultsComponent
  ],
  exports: [
    SurveyListComponent,
    CounterDirective
  ]
})
export class SurveyLibraryModule {}
