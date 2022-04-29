import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { environment } from 'environment.localhost';
import { QboConnectorPost } from '../core/models/configuration/qbo-connector.model';
import { OnboardingState } from '../core/models/enum/enum.model';
import { QboConnectorService } from '../core/services/configuration/qbo-connector.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QboCallbackComponent implements OnInit {

  constructor(
    private qboConnectorService: QboConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

  private postQboCredentials(code: string, realmId: string): void {
    const qboAuthResponse: QboConnectorPost = {
      code: code,
      realm_id: realmId,
      redirect_uri: `${environment.app_url}/qbo_callback`
    };

    this.qboConnectorService.connectQBO(qboAuthResponse).subscribe(() => {
      this.router.navigate([`/workspaces/main/dashboard`]);
    }, (error) => {
      // TODO: personalise the message based on the error (if it's an actual error / different company connect)
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      this.snackBar.open(errorMessage, '', { duration: 7000 });
      this.router.navigate([`/workspaces/onboarding/landing`]);
    });
  }

  private checkProgressAndRedirect(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code: this.route.snapshot.queryParams.code,
        realmId: this.route.snapshot.queryParams.realmId
      }
    };

    const onboardingState: OnboardingState = this.workspaceService.getOnboardingState();

    if (onboardingState !== OnboardingState.COMPLETE) {
      this.router.navigate(['workspaces/onboarding/qbo_connector'], navigationExtras);
    } else {
      this.postQboCredentials(this.route.snapshot.queryParams.code, this.route.snapshot.queryParams.realmId);
    }
  }

  ngOnInit(): void {
    this.checkProgressAndRedirect();
  }
}
