import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyUpdateSettingsComponent } from './shopify-update-settings.component';

describe('ShopifyUpdateSettingsComponent', () => {
  let component: ShopifyUpdateSettingsComponent;
  let fixture: ComponentFixture<ShopifyUpdateSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopifyUpdateSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyUpdateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
