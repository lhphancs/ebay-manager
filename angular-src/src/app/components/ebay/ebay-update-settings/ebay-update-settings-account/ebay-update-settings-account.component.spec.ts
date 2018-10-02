import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayUpdateSettingsAccountComponent } from './ebay-update-settings-account.component';

describe('EbayUpdateSettingsAccountComponent', () => {
  let component: EbayUpdateSettingsAccountComponent;
  let fixture: ComponentFixture<EbayUpdateSettingsAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayUpdateSettingsAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayUpdateSettingsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
