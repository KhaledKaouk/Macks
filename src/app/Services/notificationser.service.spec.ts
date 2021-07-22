import { TestBed } from '@angular/core/testing';

import { NotifictationtoolService } from './notifictationtool.service';

describe('NotifictationtoolService', () => {
  let service: NotifictationtoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifictationtoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
