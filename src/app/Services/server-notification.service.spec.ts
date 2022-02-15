import { TestBed } from '@angular/core/testing';

import { ServerNotificationService } from './server-notification.service';

describe('ServerNotificationService', () => {
  let service: ServerNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
