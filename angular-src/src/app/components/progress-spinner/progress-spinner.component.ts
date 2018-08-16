import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent implements OnInit {
  @Input('msg') loadingMsg:string;

  constructor() { }

  ngOnInit() {
  }

}
