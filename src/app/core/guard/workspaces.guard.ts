import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { QboConnectorService } from '../services/configuration/qbo-connector.service';
import { WorkspaceService } from '../services/workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  constructor(
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return forkJoin(
        [
          this.qboConnectorService.getQBOCredentials(),
          this.qboConnectorService.getPreferences()
        ]
      ).pipe(
        map(response => !!response),
        catchError(error => {
          // TODO: fix error message
          if (error.status === 400 && (error.error.message === 'Quickbooks Online connection expired' || error.error.message === 'QBO credentials not found in workspace')) {
            // TODO: redirect to dashboard if workspace is already onboarded
            // TODO: content
            this.snackBar.open('Quickbooks Online connection expired, please connect again', '', { duration: 7000 });
            return this.router.navigateByUrl(`workspaces/${workspaceId}/onboarding/qbo_connector`);
          }

          return throwError(error);
        })
      );
  }
  
}
