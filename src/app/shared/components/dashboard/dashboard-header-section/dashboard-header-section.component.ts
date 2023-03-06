import { Component, Input, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ClickEvent, ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-dashboard-header-section',
  templateUrl: './dashboard-header-section.component.html',
  styleUrls: ['./dashboard-header-section.component.scss']
})
export class DashboardHeaderSectionComponent implements OnInit {

  @Input() name: string;

  constructor(
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  refreshQBODimensions(): void {
    this.trackingService.onClickEvent(ClickEvent.SYNC_DIMENSION, {phase: ProgressPhase.POST_ONBOARDING});
    this.workspaceService.refreshQBODimensions().subscribe();
    this.workspaceService.refreshFyleDimensions().subscribe();
    this.snackBar.open('Refreshing data dimensions from QuickBooks Online...');
    }

  ngOnInit(): void {
  }

}
