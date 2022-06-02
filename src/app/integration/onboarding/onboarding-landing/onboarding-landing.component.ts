import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClickEvent, OnboardingState, OnboardingStep, ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit, OnDestroy {

  phase: ProgressPhase;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  constructor(
    private authService: AuthService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.LANDING, {phase: this.phase, durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  connectQbo(): void {
    this.trackingService.onClickEvent(ClickEvent.CONNECT_QBO, {phase: this.phase});
    this.trackSessionTime('success');
    this.authService.redirectToQboOAuth();
  }

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.phase = this.workspaceService.getOnboardingState() === OnboardingState.COMPLETE ? ProgressPhase.POST_ONBOARDING : ProgressPhase.ONBOARDING;
    this.trackingService.onQBOLanding(this.phase);
  }

}
