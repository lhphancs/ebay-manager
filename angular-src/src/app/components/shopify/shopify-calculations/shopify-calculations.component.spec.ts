import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyCalculationsComponent } from './shopify-calculations.component';

describe('ShopifyCalculationsComponent', () => {
  let component: ShopifyCalculationsComponent;
  let fixture: ComponentFixture<ShopifyCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopifyCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopifyCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
