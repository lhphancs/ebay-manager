import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayUpdateKeyComponent } from './ebay-update-key.component';

describe('EbayUpdateKeyComponent', () => {
  let component: EbayUpdateKeyComponent;
  let fixture: ComponentFixture<EbayUpdateKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayUpdateKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayUpdateKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
