import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayShippingComponent } from './ebay-shipping.component';

describe('EbayShippingComponent', () => {
  let component: EbayShippingComponent;
  let fixture: ComponentFixture<EbayShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
