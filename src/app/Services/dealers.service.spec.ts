import { TestBed } from '@angular/core/testing';

import { DealersService } from './dealers.service';

describe('DealersService', () => {
  let service: DealersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
