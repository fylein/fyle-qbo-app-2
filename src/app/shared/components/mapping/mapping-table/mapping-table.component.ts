import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-mapping-table',
  templateUrl: './mapping-table.component.html',
  styleUrls: ['./mapping-table.component.scss']
})
export class MappingTableComponent implements OnInit {

  @Input() mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);

  @Input() sourceType: string | undefined;

  @Input() destinationType: string | undefined;

  @Input() mappingForm: FormGroup[];

  @Input() qboData: DestinationAttribute[];

  @Output() mappingSaveHandler = new EventEmitter<MappingList>();

  displayedColumns: string[] = ['fyle', 'qbo', 'state'];

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    public helperService: HelperService
  ) { }

  saveMapping(selectedRow: MappingList, selectedOption: DestinationAttribute, searchForm: FormGroup): void {
    searchForm.patchValue({
      destination: selectedOption.value,
      searchOption: '',
      source: searchForm.value.source
    });

    if (this.sourceType?.toUpperCase() === EmployeeFieldMapping.EMPLOYEE) {
      selectedRow.qbo.id = selectedOption.id;
    } else {
      selectedRow.qbo.id = selectedOption.destination_id;
    }

    selectedRow.qbo.value = selectedOption.value;

    this.mappingSaveHandler.emit(selectedRow);
  }

  ngOnInit(): void {
  }

}
