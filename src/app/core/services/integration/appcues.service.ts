import { Injectable } from '@angular/core';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class AppcuesService {

  constructor(
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  get appcues() {
    return (window as any).Appcues;
  }

  initialiseAppcues(): void {
    const user = this.userService.getUserProfile();
    this.appcues.identify(user.user_id, {
      email: user.email,
      name: user.full_name,
      'Org ID': user.org_id,
      'Workspace ID': this.workspaceService.getWorkspaceId(),
      'Workspace Name': user.org_name,
      source: 'Fyle Quickbooks Integration - 2'
    });
  }
}
