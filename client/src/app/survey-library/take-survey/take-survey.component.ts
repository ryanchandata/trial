import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from 'src/app/model/survey.model';
import { SurveyRepository } from 'src/app/model/survey.repository';
import { Question, Option } from '../../interfaces';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.css']
})

export class TakeSurveyComponent implements OnInit, AfterViewInit {
  // survey: Survey;
  // TODO: include overlay in html
  showCannotTakeOverlay: boolean;

  constructor(
    private route: ActivatedRoute,
    private surveyRepository: SurveyRepository,
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (this.survey) {
      this.survey.questions.forEach((question, i) => {
        question.chosenOptions = ['test'];

        // reset count to zero. update will be in backend
        this.survey.questions[i].options.forEach(option => {
          option.count = 0;
        });
      });
    }
  }

  get survey(): Survey {
    const id = this.route.snapshot.params.id;
    return this.surveyRepository.getSurvey(id);
  }

  // reroute if survey is inactive
  ngAfterViewInit(): void {
    if (this.survey && !this.surveyRepository.isActive(this.survey)){

      // removove elements from site
      const content = document.getElementById('mainContainer');
      content.parentNode.removeChild(content);

      // display alert
      Swal.fire({
        title: 'OOPS! :(',
        text: 'You can\'t take this survey yet!',
        icon: 'warning',
        width: 800,
        padding: '3em',
        allowOutsideClick: false,
        backdrop: `
          rgba(0,0,0,0.9)
        `
      }).then((result) => {
        if (result.value) {
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  onCancelSubmit(event: Event): void {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your answers will not be saved.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, I\'m sure',
      cancelButtonText: 'No, keep working'
    }).then((result) => {
      if (result.value) {
        this.router.navigateByUrl('/');
      }
    });
  }

  onConfirmSubmit(event: Event): void {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able change your answers.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'No, keep working'
    }).then((result) => {
      if (result.value) {
        this.surveySave();
      }
    });
  }

  surveySave(): void {

    // checking the selected option and updating the options count
    for (let index = 0; index <=  this.survey.questions.length - 1; index++)
    {
      const question = this.survey.questions[index];
      const options = this.survey.questions[index].options;
      const chosenOptions = this.survey.questions[index].chosenOptions;

      for (let j = 0; j <= options.length - 1; j++)
      {
        for (let m = 0; m <= chosenOptions.length - 1; m++)
        {
          if (question.chosenOptions[m] === question.options[j]._id)
          {
            question.options[j].count++;
          }
        }
      }

      question.chosenOptions = undefined; // reset chosen option
    }

    this.surveyRepository.takeSurvey(this.survey).subscribe(data => {
      const error = data.error;

      if (error) {
        Swal.fire({
          title: 'Oh no! :(',
          text: 'Something bad happened, please try again',
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: 'Submitted!',
          text: 'Thank you for completing this survey :)',
          icon: 'success',
          allowOutsideClick: false
        }).then(result => {
          if (result.isConfirmed) {
            this.router.navigateByUrl('/');
          }
        });
      }
    });
  }


  onSelectOption(question: Question, optionId: string): void {

    // initializing array
    if (!question.chosenOptions) {
      question.chosenOptions = [];
    }

    if (question.optionType === 'radio')  {
      question.chosenOptions[0] = optionId;
    } else if (question.optionType === 'checkbox') {
      if (!question.chosenOptions.includes(optionId)) // if first selection
      {
        question.chosenOptions.push(optionId); // add to chosen options
      } else {
        question.chosenOptions.splice(question.chosenOptions.indexOf(optionId), 1); // else remove
      }
    }
  }

  checkIfSelected(question: Question, optionId: string): boolean {
    if (question && question.chosenOptions && optionId) {
      const condition = question.chosenOptions.indexOf(optionId) > -1; // checks if the option is in the array
      return condition;
    }
  }
}
