import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from '../core/models/db/user.model';
import { Workspace } from '../core/models/db/workspace.model';
import { OnboardingState } from '../core/models/enum/enum.model';
import { StorageService } from '../core/services/core/storage.service';
import { WindowService } from '../core/services/core/window.service';
import { UserService } from '../core/services/misc/user.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  user: MinimalUser;
  workspace: Workspace;
  windowReference: Window;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    this.storageService.set('workspaceId', this.workspace.id);
    if (pathName === '/workspaces') {
      const onboardingStateComponentMap = {
        [OnboardingState.CONNECTION]: '/workspaces/onboarding/landing',
        [OnboardingState.MAP_EMPLOYEES]: '/workspaces/onboarding/employee_settings',
        [OnboardingState.EXPORT_SETTINGS]: '/workspaces/onboarding/export_settings',
        [OnboardingState.IMPORT_SETTINGS]: '/workspaces/onboarding/import_settings',
        [OnboardingState.ADVANCED_SETTINGS]: '/workspaces/onboarding/advanced_settings',
        [OnboardingState.COMPLETE]: '/workspaces/main'
      };

      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private getOrCreateWorkspace(): Promise<Workspace> {
    return this.workspaceService.getWorkspaces(this.user.org_id).toPromise().then(workspaces => {
      if (workspaces.length > 0) {
        return workspaces[0];
      } else {
        return this.workspaceService.createWorkspace().toPromise().then(workspace => {
          return workspace;
        });
      }
    });
  }

  private setupWorkspace(): void {
    this.user = this.userService.getUserProfile();
    this.getOrCreateWorkspace().then((workspace: Workspace) => {
      this.workspace = workspace;
      this.storageService.set('currency', workspace.fyle_currency);
      this.workspaceService.syncFyleDimensions().subscribe();
      this.workspaceService.syncQBODimensions().subscribe();
      this.navigate();
    });
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
