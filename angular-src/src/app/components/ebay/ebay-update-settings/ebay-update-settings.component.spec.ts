import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EbayUpdateSettingsComponent } from './ebay-update-settings.component';

describe('EbayUpdateSettingsComponent', () => {
  let component: EbayUpdateSettingsComponent;
  let fixture: ComponentFixture<EbayUpdateSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EbayUpdateSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EbayUpdateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
