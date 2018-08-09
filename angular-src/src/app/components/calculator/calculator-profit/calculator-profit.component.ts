import { CalculatorComponent } from './../calculator.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator-profit',
  templateUrl: './calculator-profit.component.html',
  styleUrls: ['./calculator-profit.component.css']
})
export class CalculatorProfitComponent implements OnInit {

  constructor(private calculatorComponent:CalculatorComponent) {

  }

  ngOnInit() {
  }

}
