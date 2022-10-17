import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingList } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping, FyleField, QBOField, SearchType, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

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

  SearchType = SearchType;

  isSearchInProgress: boolean = false;

  existingQboOptions: DestinationAttribute[];

  constructor(
    public helperService: HelperService,
    private mappingService: MappingService
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

  prepareQBOOptions(results: DestinationAttribute[]){
    const data = this.mappings.data.filter((value) => value.state === 'MAPPED');
    const mapped_attribute: DestinationAttribute[]=[];
    data.forEach( (value) => {
      mapped_attribute.push(this.qboData.filter((results) => results.value === value.qbo.value)[0]);
  });
    const unique_mapped_attribute = [...new Set(mapped_attribute)];
    results.forEach((value) => {
      var index = unique_mapped_attribute.findIndex((res) => res?.value === value.value);
      if (index !== -1){
        unique_mapped_attribute.splice(index, 1);
      }
    });
    results = results.concat(unique_mapped_attribute);
    this.qboData = results.sort((a, b) => (a.value > b.value ? 1 : -1));
    this.isSearchInProgress = false;
  }

  advancedSearchHandler(searchTerm: string){
    if (searchTerm && searchTerm!=='loading...' && searchTerm.length>1){
      let qboData$;
      if (this.destinationType === EmployeeFieldMapping.EMPLOYEE) {
        qboData$ = this.mappingService.getQBOEmployees(searchTerm);
      } else if (this.destinationType === EmployeeFieldMapping.VENDOR) {
        qboData$ = this.mappingService.getQBOVendors(searchTerm);
      } else {
        const attribute = this.destinationType ? this.destinationType : QBOField.ACCOUNT;
        qboData$ = this.mappingService.getSearchedQBODestinationAttributes(attribute);
      }
      qboData$.subscribe((response) => {
        this.prepareQBOOptions(response);
      });
    } else if (searchTerm && searchTerm==='loading...'){
      this.isSearchInProgress = true;
    } else {
      this.prepareQBOOptions(this.existingQboOptions);
    }
  }

  ngOnInit(): void {
    this.existingQboOptions = this.qboData;
  }

}
