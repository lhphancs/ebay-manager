import { TestBed, inject } from '@angular/core/testing';

import { DatabaseProductsService } from './database-products.service';

describe('DatabaseProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseProductsService]
    });
  });

  it('should be created', inject([DatabaseProductsService], (service: DatabaseProductsService) => {
    expect(service).toBeTruthy();
  }));
});
