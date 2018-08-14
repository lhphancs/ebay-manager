import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingsEditComponent } from './shippings-edit.component';

describe('ShippingsEditComponent', () => {
  let component: ShippingsEditComponent;
  let fixture: ComponentFixture<ShippingsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
