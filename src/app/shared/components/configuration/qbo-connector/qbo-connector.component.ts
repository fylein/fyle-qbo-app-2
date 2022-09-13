import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ExportSettingGet } from 'src/app/core/models/configuration/export-setting.model';
import { QboConnectorPost, QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ClickEvent, ConfigurationCtaText, OnboardingState, OnboardingStep, ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-qbo-connector',
  templateUrl: './qbo-connector.component.html',
  styleUrls: ['./qbo-connector.component.scss']
})
export class QboConnectorComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  qboConnectionInProgress: boolean;

  isQboConnected: boolean = true;

  qboTokenExpired: boolean;

  showDisconnectQBO: boolean;

  isContinueDisabled: boolean = true;

  isOnboarding: boolean = false;

  qboCompanyName: string | null;

  fyleOrgName: string = this.userService.getUserProfile().org_name;

  windowReference: Window;

  ConfigurationCtaText = ConfigurationCtaText;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private qboConnectorService: QboConnectorService,
    private exportSettingService: ExportSettingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.CONNECT_QBO, {phase: ProgressPhase.ONBOARDING, durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  continueToNextStep(): void {
    if (this.isContinueDisabled) {
      return;
    }

    this.trackSessionTime('success');
    this.router.navigate([`/workspaces/onboarding/employee_settings`]);
  }

  switchFyleOrg(): void {
    this.authService.logout();
    this.authService.redirectToFyleOAuth();
  }

  connectQbo(): void {
    this.authService.redirectToQboOAuth();
  }

  disconnectQbo(): void {
    this.isLoading = true;
    this.qboConnectorService.disconnectQBOConnection().subscribe(() => {
      this.trackingService.onClickEvent(ClickEvent.RECONNECT_QBO, {oldCompanyName: this.qboCompanyName});
      this.showDisconnectQBO = false;
      this.qboCompanyName = null;
      this.getSettings();
    });
  }

  private showOrHideDisconnectQBO(): void {
    this.exportSettingService.getExportSettings().subscribe((exportSettings: ExportSettingGet) => {
      // Do nothing
      this.isContinueDisabled = false;
      this.isLoading = false;

      if (!(exportSettings.workspace_general_settings?.reimbursable_expenses_object || exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object)) {
        this.showDisconnectQBO = true;
      }
    }, () => {
      // Showing Disconnect QBO button since the customer didn't set up the next step
      this.showDisconnectQBO = true;
      this.isLoading = false;
    });
  }

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

    this.qboConnectorService.connectQBO(qboAuthResponse).subscribe((qboCredentials: QBOCredentials) => {
      this.workspaceService.refreshQBODimensions().subscribe(() => {
        this.trackingService.onOnboardingStepCompletion(OnboardingStep.CONNECT_QBO, 1);
        this.workspaceService.setOnboardingState(OnboardingState.MAP_EMPLOYEES);
        this.qboConnectionInProgress = false;
        this.qboCompanyName = qboCredentials.company_name;
        this.showOrHideDisconnectQBO();
      });
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      if (errorMessage === 'Please choose the correct Quickbooks online account') {
        this.showWarningDialog();
      } else {
        this.snackBar.open(errorMessage, '', { duration: 7000 });
        this.router.navigate([`/workspaces/onboarding/landing`]);
      }
    });
  }

  private getSettings(): void {
    this.qboConnectorService.getQBOCredentials().subscribe((qboCredentials: QBOCredentials) => {
      this.qboCompanyName = qboCredentials.company_name;
      this.showOrHideDisconnectQBO();
    }, (error) => {
      // Token expired
      if ('id' in error.error) {
        // We have a QBO row present in DB
        this.qboTokenExpired = error.error.is_expired;
        if (this.qboTokenExpired) {
          this.qboCompanyName = error.error.company_name;
        }
      }

      this.isQboConnected = false;
      this.isContinueDisabled = true;
      this.isLoading = false;
    });
  }

  private setupPage(): void {
    const code = this.route.snapshot.queryParams.code;
    const realmId = this.route.snapshot.queryParams.realmId;
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    if (code && realmId) {
      this.isLoading = false;
      this.qboConnectionInProgress = true;
      this.postQboCredentials(code, realmId);
    } else {
      this.getSettings();
    }
  }

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
