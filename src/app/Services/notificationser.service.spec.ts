import { TestBed } from '@angular/core/testing';

import { NotificationserService } from './notificationser.service';

describe('NotificationserService', () => {
  let service: NotificationserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
