import { TestBed, inject } from '@angular/core/testing';

import { DatabaseUsersService } from './database-users.service';

describe('DatabaseUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseUsersService]
    });
  });

  it('should be created', inject([DatabaseUsersService], (service: DatabaseUsersService) => {
    expect(service).toBeTruthy();
  }));
});
