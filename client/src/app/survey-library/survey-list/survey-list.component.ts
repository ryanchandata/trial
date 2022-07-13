import { Component, OnInit } from '@angular/core';
import { Survey } from '../../model/survey.model';
import { SurveyRepository } from '../../model/survey.repository';



@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit {

  public surveysPerPage = 4;
  public selectedPage = 1;


  constructor(private repository: SurveyRepository) { }

  ngOnInit(): void {
    this.repository.initializeSurveys();
  }

  // returns active surveys
  get surveys(): Survey[]
  {
    // for pagination
    const pageIndex = (this.selectedPage - 1) * this.surveysPerPage;

    // sort by by closing date
    const surveysTOReturn = this.repository.getActiveSurveys().sort((a, b) =>
      ((new Date(b.dateExpire)).getTime() < (new Date (a.dateExpire)).getTime()) ? 1 : -1
    );

    return surveysTOReturn.slice(pageIndex, pageIndex + this.surveysPerPage);
  }

  changePage(newPage: number): void
  {
    this.selectedPage = newPage;
  }

  changePageSize(newSize: number): void
  {
    this.surveysPerPage = Number(newSize);
    this.changePage(1);
  }

  get pageCount(): number
  {
    return Math.ceil(this.repository
      .getActiveSurveys().length / this.surveysPerPage);
  }
}
