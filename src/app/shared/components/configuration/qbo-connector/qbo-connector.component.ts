import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environment.localhost';
import { EmployeeSettingGet } from 'src/app/core/models/configuration/employee-setting.model';
import { QboConnector, QboConnectorPost, QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-qbo-connector',
  templateUrl: './qbo-connector.component.html',
  styleUrls: ['./qbo-connector.component.scss']
})
export class QboConnectorComponent implements OnInit {

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

  constructor(
    private authService: AuthService,
    private importSettingService: ImportSettingService,
    private qboConnectorService: QboConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  continueToNextStep(): void {
    if (this.isContinueDisabled) {
      return;
    }

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
      this.showDisconnectQBO = false;
      this.qboCompanyName = null;
      this.getSettings();
    });
  }

  private showOrHideDisconnectQBO(): void {
    this.importSettingService.getImportSettings().subscribe((employeeSettings: EmployeeSettingGet) => {
      // Do nothing
      this.isContinueDisabled = false;
      this.isLoading = false;

      if (!employeeSettings.workspace_general_settings.employee_field_mapping) {
        this.showDisconnectQBO = true;
      }
    }, () => {
      // Showing Disconnect QBO button since the customer didn't set up the next step
      this.showDisconnectQBO = true;
      this.isLoading = false;
    });
  }

  private postQboCredentials(code: string, realmId: string): void {
    const qboAuthResponse: QboConnectorPost = {
      code: code,
      realm_id: realmId,
      redirect_uri: `${environment.app_url}/qbo_callback`
    };

    this.qboConnectorService.connectQBO(qboAuthResponse).subscribe((qboCredentials: QBOCredentials) => {
      this.workspaceService.syncQBODimensions().subscribe(() => {
        this.qboConnectionInProgress = false;
        this.qboCompanyName = qboCredentials.company_name;
        this.showOrHideDisconnectQBO();
      });
    }, (error) => {
      // TODO: personalise the message based on the error (if it's an actual error / different company connect)
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to QuickBooks Online. Please try again';
      this.snackBar.open(errorMessage, '', { duration: 7000 });
      this.router.navigate([`/workspaces/onboarding/landing`]);
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

  ngOnInit(): void {
    // TODO: Fyle & QBO sync dimension
    this.setupPage();
  }

}
