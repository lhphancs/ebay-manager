import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayCalculationsComponent } from './ebay-calculations.component';

describe('EbayCalculationsComponent', () => {
  let component: EbayCalculationsComponent;
  let fixture: ComponentFixture<EbayCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
