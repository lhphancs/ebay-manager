import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseProductInfoComponent } from './database-product-info.component';

describe('DatabaseProductInfoComponent', () => {
  let component: DatabaseProductInfoComponent;
  let fixture: ComponentFixture<DatabaseProductInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseProductInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
