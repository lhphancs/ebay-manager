import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDynamicInputComponent } from './table-dynamic-input.component';

describe('TableDynamicInputComponent', () => {
  let component: TableDynamicInputComponent;
  let fixture: ComponentFixture<TableDynamicInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDynamicInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDynamicInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
