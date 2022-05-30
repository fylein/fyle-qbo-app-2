import { Injectable } from '@angular/core';
import { RefinerSurveyType } from '../../models/enum/enum.model';

@Injectable({
  providedIn: 'root'
})
export class RefinerService {

  private readonly onboardingDoneSurveryID: string = '479f4880-da7c-11ec-83f1-2908310c8a20';

  constructor() { }

  triggerSurvey(actionName: RefinerSurveyType): void {
    (window as any)._refiner('identifyUser', {
      id: 'ashwin1113',
      email: 'ashwin4@ashwin2.ashwin2',
      name: 'Ashwin24',
      account: {
        workspace_id: 364234,
        workspace_name: 'Fyle HQ 3'
      },
      source: 'Fyle Quickbooks Integration',
      action_name: actionName
    });
    (window as any)._refiner('showForm', this.onboardingDoneSurveryID);
  }
}
