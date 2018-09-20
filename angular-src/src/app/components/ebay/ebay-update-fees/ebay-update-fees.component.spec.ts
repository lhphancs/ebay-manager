import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayUpdateFeesComponent } from './ebay-update-fees.component';

describe('EbayUpdateFeesComponent', () => {
  let component: EbayUpdateFeesComponent;
  let fixture: ComponentFixture<EbayUpdateFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayUpdateFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayUpdateFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
