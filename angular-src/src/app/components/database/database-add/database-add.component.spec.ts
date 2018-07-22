import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseAddComponent } from './database-add.component';

describe('DatabaseAddComponent', () => {
  let component: DatabaseAddComponent;
  let fixture: ComponentFixture<DatabaseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
