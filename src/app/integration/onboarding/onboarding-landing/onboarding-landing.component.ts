import { Component, OnInit } from '@angular/core';
import { ClickEvent, OnboardingState, ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { TrackingService } from 'src/app/core/services/core/tracking.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  phase: ProgressPhase;

  constructor(
    private authService: AuthService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  connectQbo(): void {
    this.trackingService.onClickEvent(ClickEvent.CONNECT_QBO, {phase: this.phase});
    this.authService.redirectToQboOAuth();
  }

  ngOnInit(): void {
    this.phase = this.workspaceService.getOnboardingState() === OnboardingState.COMPLETE ? ProgressPhase.POST_ONBOARDING : ProgressPhase.ONBOARDING;
    this.trackingService.onQBOLanding(this.phase);
  }

}
