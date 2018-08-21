import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingsAddOrUpdateComponent } from './shippings-add-or-update.component';

describe('ShippingsAddOrUpdateComponent', () => {
  let component: ShippingsAddOrUpdateComponent;
  let fixture: ComponentFixture<ShippingsAddOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingsAddOrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingsAddOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
