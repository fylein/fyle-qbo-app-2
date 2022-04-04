import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { WorkspacesGuard } from './workspaces.guard';
import { MatSnackBarModule} from '@angular/material/snack-bar';

describe('WorkspacesGuard', () => {
  let guard: WorkspacesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule,MatSnackBarModule]
    });
    guard = TestBed.inject(WorkspacesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
