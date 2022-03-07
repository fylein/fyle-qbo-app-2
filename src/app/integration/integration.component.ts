import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from '../core/models/db/user.model';
import { Workspace } from '../core/models/db/workspace.model';
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
      this.router.navigateByUrl(`/workspaces/${this.workspace.id}/onboarding`);
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
      this.navigate();
    });
  }

  ngOnInit(): void {
    this.setupWorkspace();
  }

}
