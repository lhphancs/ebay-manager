import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseProductsComponent } from './database-products.component';

describe('DatabaseProductsComponent', () => {
  let component: DatabaseProductsComponent;
  let fixture: ComponentFixture<DatabaseProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
