import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorNeededSaleComponent } from './calculator-needed-sale.component';

describe('CalculatorNeededSaleComponent', () => {
  let component: CalculatorNeededSaleComponent;
  let fixture: ComponentFixture<CalculatorNeededSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorNeededSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorNeededSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
