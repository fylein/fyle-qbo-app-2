import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { DisconnectQboDialogComponent } from '../../dashboard/disconnect-qbo-dialog/disconnect-qbo-dialog.component';

@Component({
  selector: 'app-onboarding-header',
  templateUrl: './onboarding-header.component.html',
  styleUrls: ['./onboarding-header.component.scss']
})
export class OnboardingHeaderComponent implements OnInit {

  user: MinimalUser;
  isQboConnected: boolean = true;
  isProfileExpanded: boolean;
  currency: string = this.workspaceService.getFyleCurrency();
  qboCompanyName: string;
  showBackButton: boolean;
  activePage: string;
  @ViewChild('menuButton') menuButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  windowReference: Window;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private location: Location,
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private renderer: Renderer2,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.menuButton.nativeElement && e.target !== this.menu.nativeElement) {
        this.isProfileExpanded = false;
      }
    });
  }

  private getActivePageName(currentPageUrl: string): string {
    if (currentPageUrl.indexOf('dashboard') > -1) {
      return 'Dashboard';
    } else if (currentPageUrl.indexOf('export_log') > -1) {
      return 'Export Logs';
    } else if (currentPageUrl.indexOf('mapping') > -1) {
      return currentPageUrl.split('/')[4] + ' mapping';
    } else if (currentPageUrl.indexOf('/configuration/employee_settings') > -1) {
      return 'Employee Settings';
    } else if (currentPageUrl.indexOf('/configuration/export_settings') > -1) {
      return 'Export Settings';
    } else if (currentPageUrl.indexOf('/configuration/import_settings') > -1) {
      return 'Import Settings';
    } else if (currentPageUrl.indexOf('/configuration/advanced_settings') > -1) {
      return 'Advanced Settings';
    }

    return '';
  }

  private setupPage(): void {
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
  }

  navigateBack() {
    this.location.back();
  }

  switchFyleOrg(): void {
    this.authService.logout();
    this.authService.redirectToFyleOAuth();
  }

  disconnectQbo(): void {
    const dialogRef = this.dialog.open(DisconnectQboDialogComponent, {
      width: '551px',
      data: {
        companyName: this.qboCompanyName
      }
    });

    dialogRef.afterClosed().subscribe((disconnect) => {
      if (disconnect) {
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

  openHelpArticle(): void {
    // TODO: Add help article url
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
