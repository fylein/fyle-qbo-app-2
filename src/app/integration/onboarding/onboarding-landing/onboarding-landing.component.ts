import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

  connectQbo(): void {
    const workspaceId = this.workspaceService.getWorkspaceId();
    // this.windowReference.location.href = QBO_AUTHORIZE_URI + '?client_id=' + QBO_CLIENT_ID + '&scope=' + QBO_SCOPE + '&response_type=code&redirect_uri=' + APP_URL + '/workspaces/qbo/callback&state=' + this.workspaceId;
    this.router.navigate([`/workspaces/${workspaceId}/onboarding/qbo_connector`]);
  }

  ngOnInit(): void {
  }

}
