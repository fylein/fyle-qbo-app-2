import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeSettingGet } from 'src/app/core/models/configuration/employee-setting.model';
import { QboConnector, QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
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
  qboTokenExpired: boolean;
  showDisconnectQBO: boolean;
  isContinueDisabled: boolean = true;
  workspaceId: string = this.workspaceService.getWorkspaceId();
  qboCompanyName: string;
  fyleOrgName: string = this.userService.getUserProfile().org_name;

  constructor(
    private authService: AuthService,
    private importSettingService: ImportSettingService,
    private qboConnectorService: QboConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  continueToNextStep(): void {
    if (this.isContinueDisabled) {
      return;
    }

    // TODO: POST call to save completed info in DB
    this.router.navigate([`/workspaces/${this.workspaceId}/onboarding/employee_settings`]);
  }

  switchFyleOrg(): void {
    this.authService.logout();
    this.authService.redirectToFyleOAuth();
  }

  connectQbo(): void {
    this.authService.redirectToQboOAuth();
  }

  disconnectQbo(): void {
    // TODO: Implement
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
    const qboAuthResponse: QboConnector = {
      code: code,
      realm_id: realmId
    };

    this.qboConnectorService.connectQBO(qboAuthResponse).subscribe((qboCredentials: QBOCredentials) => {
      this.workspaceService.syncQBODimensions().subscribe(() => {
        this.qboConnectionInProgress = false;
        this.qboCompanyName = qboCredentials.company_name;
        this.showOrHideDisconnectQBO();
      });
    }, () => {
      this.snackBar.open('Failed to connect to QuickBooks Online. Please try again');
      this.router.navigate([`/workspaces/${this.workspaceId}/onboarding/landing`]);
    });
  }

  private setupPage(): void {
    const code = this.route.snapshot.queryParams.code;
    const realmId = this.route.snapshot.queryParams.realmId;
    if (code && realmId) {
      this.isLoading = false;
      this.qboConnectionInProgress = true;
      this.postQboCredentials(code, realmId);
    } else {
      this.qboConnectorService.getQBOCredentials().subscribe((qboCredentials: QBOCredentials) => {
        this.qboCompanyName = qboCredentials.company_name;
        this.showOrHideDisconnectQBO();
      }, () => {
        // Token expired
        // TODO: Handle QBO company name
        this.qboTokenExpired = true;
        this.isLoading = false;
      });
    }
  }

  ngOnInit(): void {
    // TODO: Fyle dimension sync
    this.setupPage();
  }

}
