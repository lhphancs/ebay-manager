import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEbayKeyComponent } from './account-ebay-key.component';

describe('AccountEbayKeyComponent', () => {
  let component: AccountEbayKeyComponent;
  let fixture: ComponentFixture<AccountEbayKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountEbayKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEbayKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
