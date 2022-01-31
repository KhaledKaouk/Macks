import { TestBed } from '@angular/core/testing';

import { BOLService } from './bol.service';

describe('BOLService', () => {
  let service: BOLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BOLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
