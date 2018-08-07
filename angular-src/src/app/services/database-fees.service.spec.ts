import { TestBed, inject } from '@angular/core/testing';

import { DatabaseFeesService } from './database-fees.service';

describe('DatabaseFeesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseFeesService]
    });
  });

  it('should be created', inject([DatabaseFeesService], (service: DatabaseFeesService) => {
    expect(service).toBeTruthy();
  }));
});
