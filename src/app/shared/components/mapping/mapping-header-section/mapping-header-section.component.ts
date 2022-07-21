import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { AutoMapEmployee } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-mapping-header-section',
  templateUrl: './mapping-header-section.component.html',
  styleUrls: ['./mapping-header-section.component.scss']
})
export class MappingHeaderSectionComponent implements OnInit {

  @Input() totalCardActive: boolean;

  @Input() sourceType: string;

  @Input() customMapping: boolean;

  @Input() mappingStats: Partial<MappingStats>;

  @Input() autoMapEmployee: AutoMapEmployee | null;

  @Output() mappingCardUpdateHandler = new EventEmitter<boolean>();

  constructor(
    private mappingService: MappingService,
    private snackBar: MatSnackBar
  ) { }

  switchView(totalCardActive: boolean = false): void {
    this.totalCardActive = totalCardActive;

    this.mappingCardUpdateHandler.emit(this.totalCardActive);
  }

  triggerAutoMapEmployee(): void {
    this.mappingService.triggerAutoMapEmployees().subscribe(() => this.snackBar.open('Auto mapping of employees may take few minutes'));
  }

  ngOnInit(): void {
  }

}
