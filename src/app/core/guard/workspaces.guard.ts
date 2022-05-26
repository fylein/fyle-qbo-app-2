import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { OnboardingState } from '../models/enum/enum.model';
import { QboConnectorService } from '../services/configuration/qbo-connector.service';
import { TrackingService } from '../services/core/tracking.service';
import { WorkspaceService } from '../services/workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspacesGuard implements CanActivate {

  constructor(
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
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
          if (error.status === 400) {
            globalCacheBusterNotifier.next();
            this.trackingService.onQBOAccountDisconnect();
            this.snackBar.open('Oops! Your QBO connection expired, please connect again', '', { duration: 7000 });

            const onboardingState: OnboardingState = this.workspaceService.getOnboardingState();

            if (onboardingState !== OnboardingState.COMPLETE) {
              return this.router.navigateByUrl('workspaces/onboarding/qbo_connector');
            } else {
              return this.router.navigateByUrl('workspaces/onboarding/landing');
            }
          }

          return throwError(error);
        })
      );
  }

}
