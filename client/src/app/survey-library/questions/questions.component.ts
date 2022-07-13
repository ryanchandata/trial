import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/interfaces';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})

export class QuestionsComponent implements OnInit {
  constructor() { }
  @Input() questions;
  @Output() edit = new EventEmitter();

  ngOnInit(): void {
  }

  onEdit(question: Question): void {
    this.edit.emit(question);
  }

  onDelete(question: Question): void {
    const index = this.questions.indexOf(question);
    this.questions.splice(index, 1);
  }

}
