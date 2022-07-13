import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/interfaces';
import { Survey } from 'src/app/model/survey.model';
import { SurveyRepository } from 'src/app/model/survey.repository';
import { User } from 'src/app/model/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-display-results',
  templateUrl: './display-results.component.html',
  styleUrls: ['./display-results.component.css']
})
export class DisplayResultsComponent implements OnInit, AfterViewInit {

  user: User;

  // for exporting to excel document
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  ExportTOExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Survey Results');
    XLSX.writeFile(wb, this.survey.name + '.xlsx');
  }

  constructor(
    private router: Router,
    private surveyRepository: SurveyRepository,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  get survey(): Survey
  {
    // display only surveys made by current user
    const id = this.route.snapshot.params.id;
    return this.surveyRepository.getSurvey(id);
  }

  get questions(): Question[]
  {
    return this.survey.questions;
  }

  ngAfterViewInit(): void {
    // reroute user if not his own survey
    if (this.user.id !== this.survey.user) {
      this.router.navigateByUrl('/');
    }
  }

  onConfirmReset(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able recover these statistics.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, I\'m sure',
      cancelButtonText: 'No, keep them'
    }).then((result) => {
      if (result.value) {
        this.resultsReset();
        Swal.fire({
          title: 'Survey results reset!',
          icon: 'success'
        });
      }
    });
  }

  resultsReset(): void {
    this.survey.responses = 0;
    for (let i = 0; i <= this.questions.length - 1 ; i++)
    {
      const options = this.questions[i].options;
      for (let j = 0; j <= options.length - 1; j ++) {
        options[j].count = 0;
      }
    }

    this.surveyRepository.updateSurvey(this.survey , this.user.id).subscribe(data => {
      const error = data.error;
      if (error) {
        Swal.fire({
          title: 'Oh no! :(',
          text: 'Something bad happened, please try again',
          icon: 'error'
        });
      }
    });
  }
}
