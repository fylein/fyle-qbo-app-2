import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MinimalUser } from '../../models/db/user.model';
import { RefinerSurveyType } from '../../models/enum/enum.model';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class RefinerService {

  private readonly onboardingDoneSurveryID: string = environment.refiner_survey.onboarding_done_survery_id;

  private readonly exportDoneSurveryID: string = environment.refiner_survey.export_done_survery_id;

  private readonly cloneSettingsSurveyId: string = environment.refiner_survey.clone_settings_save_survey_id;

  private readonly user: MinimalUser = this.userService.getUserProfile();

  private readonly workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  get refiner() {
    return (window as any)._refiner;
  }

  triggerSurvey(actionName: RefinerSurveyType): void {
    if (this.refiner) {
      const surveyId = actionName === RefinerSurveyType.ONBOARDING_DONE ? this.onboardingDoneSurveryID
          : actionName === RefinerSurveyType.CLONE_SETTINGS ? this.cloneSettingsSurveyId : this.exportDoneSurveryID;

      const surveyData = {
        id: this.user.org_id,
        email: this.user.email,
        name: this.user.full_name,
        account: {
          workspace_id: this.workspaceId,
          workspace_name: this.user.org_name
        },
        source: 'Fyle Quickbooks Integration',
        action_name: actionName
      }

      this.refiner('identifyUser', surveyData);
      this.refiner('showForm', surveyId);
    }
  }
}
