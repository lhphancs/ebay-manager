import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseAddOrUpdateComponent } from './database-add-or-update.component';

describe('DatabaseAddComponent', () => {
  let component: DatabaseAddOrUpdateComponent;
  let fixture: ComponentFixture<DatabaseAddOrUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseAddOrUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseAddOrUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
