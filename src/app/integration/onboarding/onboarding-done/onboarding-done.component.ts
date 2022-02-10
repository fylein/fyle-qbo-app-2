import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceService } from 'src/app/core/services/workspace.service';

@Component({
  selector: 'app-onboarding-done',
  templateUrl: './onboarding-done.component.html',
  styleUrls: ['./onboarding-done.component.scss']
})
export class OnboardingDoneComponent implements OnInit {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService
  ) { }

  navigateToDashboard(): void {
    this.router.navigate([`/workspaces/${this.workspaceId}/dashboard`]);
  }

  ngOnInit(): void {
  }

}
