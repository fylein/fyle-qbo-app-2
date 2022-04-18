import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QBOCredentials } from 'src/app/core/models/configuration/qbo-connector.model';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { QboConnectorService } from 'src/app/core/services/configuration/qbo-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
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
  @ViewChild('menuButton') menuButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private qboConnectorService: QboConnectorService,
    private renderer: Renderer2,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.menuButton.nativeElement && e.target !== this.menu.nativeElement) {
        this.isProfileExpanded = false;
      }
    });
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

  ngOnInit(): void {
    this.setupPage();
  }

}
