import { TestBed, inject } from '@angular/core/testing';

import { DatabaseShippingsService } from './database-shippings.service';

describe('DatabaseShippingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseShippingsService]
    });
  });

  it('should be created', inject([DatabaseShippingsService], (service: DatabaseShippingsService) => {
    expect(service).toBeTruthy();
  }));
});
