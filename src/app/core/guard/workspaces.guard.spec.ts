import { TestBed } from '@angular/core/testing';

import { WorkspacesGuard } from './workspaces.guard';

describe('WorkspacesGuard', () => {
  let guard: WorkspacesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WorkspacesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
