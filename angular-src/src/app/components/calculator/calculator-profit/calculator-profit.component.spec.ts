import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorProfitComponent } from './calculator-profit.component';

describe('CalculatorProfitComponent', () => {
  let component: CalculatorProfitComponent;
  let fixture: ComponentFixture<CalculatorProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
