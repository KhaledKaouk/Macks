import { TestBed } from '@angular/core/testing';

import { FrightpricesService } from './frightprices.service';

describe('FrightpricesService', () => {
  let service: FrightpricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrightpricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
