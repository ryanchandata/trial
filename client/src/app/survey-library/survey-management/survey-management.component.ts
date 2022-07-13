import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Survey } from 'src/app/model/survey.model';
import { SurveyRepository } from 'src/app/model/survey.repository';
import { User } from 'src/app/model/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-survey-management',
  templateUrl: './survey-management.component.html',
  styleUrls: ['./survey-management.component.css']
})
export class SurveyManagementComponent implements OnInit, AfterViewInit {
  public newSurvey: Survey;
  user: User;

  constructor(private repository: SurveyRepository) {}

  ngOnInit(): void {
    this.initializeNewSurvey();
    this.repository.initializeSurveys();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  get surveys(): Survey[]
  {
    // display only surveys made by current user
    return this.repository.getSurveys().filter((survey) => survey.user === this.user.id);
  }


  ngAfterViewInit(): void {

  }

  onCreateSurvey(): void {
    this.newSurvey.user = this.user.id;
    this.repository.addSurvey(this.newSurvey);
    this.initializeNewSurvey();
    Swal.fire({
      title: 'Survey Created',
      text: 'Select your survey to add questions',
      icon: 'success'
    });
  }

  onDeleteSurvey(survey: Survey): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able recover this survey.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete forever',
      cancelButtonText: 'No, I change my mind'
    }).then((result) => {
      if (result.value) {
        this.repository.deleteSurvey(survey, this.user.id);
        Swal.fire({
          title: 'Survey deleted',
          icon: 'success'
        });
      }
    });
  }

  onShareLink(id: string, event: any): void {
    const link = 'https://comp229-group-project-3c.herokuapp.com/surveys/take/' + id;
    // needs a text area to work. removed after copy
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    const message = document.getElementById(event.target.nextSibling.id);
    message.innerText = 'Link copied!';
  }

  showTooltip(event: any): void {
    const icon = document.getElementById(event.target.id);
    const message = document.getElementById(event.target.nextSibling.id);
    message.innerText = 'Click to copy';
    message.classList.add('show-tooltip');
    createPopper(icon, message, {
      placement: 'right-start',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    });
  }

  hideTooltip(event: any): void {
    const icon = document.getElementById(event.target.id);
    const message = document.getElementById(event.target.nextSibling.id);
    message.classList.remove('show-tooltip');
  }


  initializeNewSurvey(): void {
    this.newSurvey = {
      name: ''
    };
  }

}
