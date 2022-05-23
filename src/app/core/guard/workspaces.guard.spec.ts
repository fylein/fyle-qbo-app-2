import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { WorkspacesGuard } from './workspaces.guard';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('WorkspacesGuard', () => {
  let guard: WorkspacesGuard;
  let act: ActivatedRouteSnapshot;
  let route: RouterStateSnapshot;
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
