import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAddOrUpdateComponent } from './products-add-or-update.component';

describe('ProductsAddOrUpdateComponent', () => {
  let component: ProductsAddOrUpdateComponent;
  let fixture: ComponentFixture<ProductsAddOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsAddOrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAddOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
