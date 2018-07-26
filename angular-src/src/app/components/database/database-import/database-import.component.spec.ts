import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseImportComponent } from './database-import.component';

describe('DatabaseImportComponent', () => {
  let component: DatabaseImportComponent;
  let fixture: ComponentFixture<DatabaseImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
