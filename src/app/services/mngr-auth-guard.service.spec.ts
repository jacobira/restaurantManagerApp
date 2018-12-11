import { TestBed } from '@angular/core/testing';

import { MngrAuthGuardService } from './mngr-auth-guard.service';

describe('MngrAuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MngrAuthGuardService = TestBed.get(MngrAuthGuardService);
    expect(service).toBeTruthy();
  });
});
