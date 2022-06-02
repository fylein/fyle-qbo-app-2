import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { ClickEvent, ProgressPhase, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-onboarding-header',
  templateUrl: './onboarding-header.component.html',
  styleUrls: ['./onboarding-header.component.scss']
})
export class OnboardingHeaderComponent implements OnInit {

  user: MinimalUser;

  isQboConnected: boolean = true;

  isProfileExpanded: boolean;

  isHelpSectionExpanded: boolean;

  currency: string = this.workspaceService.getFyleCurrency();

  qboCompanyName: string;

  showBackButton: boolean;

  activePage: string;

  showSwitchApp: boolean = false;

  @ViewChild('menuButton') menuButton: ElementRef;

  @ViewChild('helpButton') helpButton: ElementRef;

  @ViewChild('help') help: ElementRef;

  @ViewChild('menu') menu: ElementRef;

  RedirectLink = RedirectLink;

  windowReference: Window;

  private phase: ProgressPhase;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private location: Location,
    public helperService: HelperService,
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private renderer: Renderer2,
    private storageService: StorageService,
    private trackingService: TrackingService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.menuButton.nativeElement && e.target !== this.menu.nativeElement) {
        this.isProfileExpanded = false;
      }

      if (e && e?.target !== this.helpButton?.nativeElement && e.target !== this.help?.nativeElement) {
        this.isHelpSectionExpanded = false;
      }
    });
  }

  private getActivePageName(currentPageUrl: string): string {
    if (currentPageUrl.indexOf('dashboard') > -1) {
      return 'Dashboard';
    } else if (currentPageUrl.indexOf('export_log') > -1) {
      return 'Export Log';
    } else if (currentPageUrl.indexOf('mapping') > -1) {
      return currentPageUrl.split('/')[4] + ' mapping';
    } else if (currentPageUrl.indexOf('/configuration/employee_settings') > -1) {
      return 'Map Employees';
    } else if (currentPageUrl.indexOf('/configuration/export_settings') > -1) {
      return 'Export Settings';
    } else if (currentPageUrl.indexOf('/configuration/import_settings') > -1) {
      return 'Import Settings';
    } else if (currentPageUrl.indexOf('/configuration/advanced_settings') > -1) {
      return 'Advanced Settings';
    } else if (currentPageUrl.indexOf('/onboarding') > -1) {
      return '';
    }

    return 'Dashboard';
  }

  private setupPage(): void {
    this.phase = this.windowReference.location.pathname.includes('onboarding') ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
    this.user = this.userService.getUserProfile();

    this.qboConnectorService.getQBOCredentials().subscribe((credentials: QBOCredentials) => {
      this.qboCompanyName = credentials.company_name;
    }, (error) => {
      this.isQboConnected = false;
      if ('id' in error.error) {
        // We have a QBO row present in DB
        this.qboCompanyName = error.error.company_name;
      }
    });

    const currentPageUrl = this.windowReference.location.pathname;

    this.activePage = this.getActivePageName(currentPageUrl);

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.showBackButton = true;

        this.activePage = this.getActivePageName(val.url);
      }
    });

    const workspaceCreatedAt: Date = this.workspaceService.getWorkspaceCreatedAt();
    const oldAppCutOffDate = new Date('2022-05-16T00:00:00.000Z');

    if (workspaceCreatedAt.getTime() < oldAppCutOffDate.getTime()) {
      this.showSwitchApp = true;
    }
  }

  navigateBack() {
    this.location.back();
  }

  switchToOldApp(): void {
    this.workspaceService.patchWorkspace().subscribe(() => {
      const user = this.userService.getUserProfile();

      const localStorageDump = {
        email: user.email,
        access_token: user.access_token,
        refresh_token: user.refresh_token,
        user: {
          employee_email: user.email,
          full_name: user.full_name,
          user_id: user.user_id,
          org_id: user.org_id,
          org_name: user.org_name
        },
        orgsCount: this.storageService.get('refresh_token')
      };

      this.trackingService.onSwitchToOldApp();
      this.windowReference.location.href = `${environment.old_qbo_app_url}?local_storage_dump=${JSON.stringify(localStorageDump)}`;
    });
  }

  switchFyleOrg(): void {
    this.authService.logout(true);
    this.authService.redirectToFyleOAuth();
  }

  disconnectQbo(): void {
    const data: ConfirmationDialog = {
      title: 'Disconnect Quickbooks Online',
      contents: `Exporting expenses from Fyle will no longer work if you disconnect your 
        Quickbooks Online Company.
        <br>
        Are you sure you want to disconnect <b>${this.qboCompanyName}</b> Quickbooks Online
        company?`,
      primaryCtaText: 'Disconnect'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((disconnect) => {
      if (disconnect) {
        this.trackingService.onClickEvent(ClickEvent.DISCONNECT_QBO, {phase: this.phase});
        this.qboConnectorService.disconnectQBOConnection().subscribe(() => {
          this.authService.redirectToOnboardingLanding();
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.authService.redirectToOnboardingLogin();
  }

  showOrHideProfileDropdown(): void {
    this.isProfileExpanded = !this.isProfileExpanded;

    event?.stopPropagation();
  }

  showOrHideHelpDropdown(): void {
    if (!this.isHelpSectionExpanded) {
      this.trackingService.onClickEvent(ClickEvent.HELP_SECTION, {phase: this.phase});
    }

    this.isHelpSectionExpanded = !this.isHelpSectionExpanded;
    event?.stopPropagation();
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
