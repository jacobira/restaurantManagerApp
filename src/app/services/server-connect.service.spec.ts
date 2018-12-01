import { TestBed } from '@angular/core/testing';

import { ServerConnectService } from './server-connect.service';

describe('ServerConnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerConnectService = TestBed.get(ServerConnectService);
    expect(service).toBeTruthy();
  });
});
