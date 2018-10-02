import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayUpdateSettingsFeesComponent } from './ebay-update-settings-fees.component';

describe('EbayUpdateSettingsFeesComponent', () => {
  let component: EbayUpdateSettingsFeesComponent;
  let fixture: ComponentFixture<EbayUpdateSettingsFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayUpdateSettingsFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayUpdateSettingsFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
