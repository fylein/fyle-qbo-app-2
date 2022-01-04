import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { QboConnectorService } from 'src/app/core/services/qbo-connector.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-qbo-connector',
  templateUrl: './qbo-connector.component.html',
  styleUrls: ['./qbo-connector.component.scss']
})
export class QboConnectorComponent implements OnInit {

  isQboConnected: boolean;

  constructor(
    private authService: AuthService,
    private qboConnectorService: QboConnectorService,
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

  continueToNextStep(): void {
    this.router.navigate([`/workspaces/${this.workspaceService.getWorkspaceId()}/onboarding/employee_settings`]);
  }

  connectQbo(): void {
    const workspaceId = this.workspaceService.getWorkspaceId();
    this.authService.redirectToQboOAuth(workspaceId);
  }

  private setupPage(): void {
    this.qboConnectorService.getQBOCredentials().subscribe(() => {
      this.isQboConnected = true;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
