import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { QboConnectorPost } from '../core/models/configuration/qbo-connector.model';
import { OnboardingState } from '../core/models/enum/enum.model';
import { ConfirmationDialog } from '../core/models/misc/confirmation-dialog.model';
import { QboConnectorService } from '../core/services/configuration/qbo-connector.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';
import { ConfirmationDialogComponent } from '../shared/components/core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QboCallbackComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private qboConnectorService: QboConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

  private showWarningDialog(): void {
    const data: ConfirmationDialog = {
      title: 'Incorrect account selected',
      contents: 'You had previously set up the integration with a different QuickBooks Online account. Please choose the same to restore the settings',
      primaryCtaText: 'Re connect',
      hideSecondaryCTA: true
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked) => {
      if (ctaClicked) {
        this.router.navigate([`/workspaces/onboarding/landing`]);
      }
    });
  }

  private postQboCredentials(code: string, realmId: string): void {
    const qboAuthResponse: QboConnectorPost = {
      code: code,
      realm_id: realmId,
      redirect_uri: `${environment.app_url}/qbo_callback`
    };

    this.qboConnectorService.connectQBO(qboAuthResponse).subscribe(() => {
      this.router.navigate([`/workspaces/main/dashboard`]);
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct QuickBooks Online account') {
        this.showWarningDialog();
      } else {
        this.snackBar.open(errorMessage, '', { duration: 7000 });
        this.router.navigate([`/workspaces/onboarding/landing`]);
      }
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
