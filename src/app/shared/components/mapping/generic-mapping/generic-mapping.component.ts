import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ExtendedExpenseAttribute, ExtendedExpenseAttributeResponse } from 'src/app/core/models/db/expense-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { MappingList, MappingModel, MappingStats } from 'src/app/core/models/db/mapping.model';
import { MappingState, PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-generic-mapping',
  templateUrl: './generic-mapping.component.html',
  styleUrls: ['./generic-mapping.component.scss']
})
export class GenericMappingComponent implements OnInit {

  sourceType: string;
  totalCardActive: boolean = true;
  isLoading: boolean = true;
  limit: number;
  offset: number;
  totalCount: number;
  mappingSetting: MappingSetting;
  mappingStats: MappingStats;
  qboData: DestinationAttribute[];
  mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);
  fyleQboMappingFormArray: FormGroup[];
  filterOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  form: FormGroup;
  mappingForm: FormGroup[];

  constructor(
    private formBuilder: FormBuilder,
    private mappingService: MappingService,
    private paginatorService: PaginatorService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  mappingCardUpdateHandler(totalCardActive: boolean): void {
    this.totalCardActive = totalCardActive;
    this.form.controls.sourceUpdated.patchValue(true);

    this.getMappings();
  }

  private getPaginator(): Paginator {
    return this.paginatorService.getPageSize(PaginatorPage.MAPPING);
  }

  private setupForm(): void {
    this.form = this.formBuilder.group({
      map: [''],
      fyleQboMapping: this.formBuilder.array(this.fyleQboMappingFormArray),
      searchOption: [''],
      filterOption: [this.filterOptions.concat()],
      sourceUpdated: [false]
    });

    this.form.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
      if (searchTerm) {
        this.mappings.filter = searchTerm.trim().toLowerCase();
      } else {
        this.mappings.filter = '';
      }
    });

    const mappingForm = this.form.controls.fyleQboMapping as FormArray;
    this.mappingForm = mappingForm.controls as FormGroup[];
  }

  private setupFyleQboMappingFormArray(mappings: MappingList[]): void {
    this.fyleQboMappingFormArray = mappings.map((mapping: MappingList) => {
      return this.formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.qbo.value]
      });
    });
  }

  getMappings(data: Paginator | void): void {
    this.isLoading = true;
    const paginator: Paginator = data ? data : this.getPaginator();

    const mappings: MappingList[] = [];

    // Store page size when user changes it
    if (this.limit !== data?.limit) {
      this.paginatorService.storePageSize(PaginatorPage.MAPPING, paginator.limit);
    }

    this.limit = paginator.limit;
    this.offset = paginator.offset;
    const mappingState = this.totalCardActive ? MappingState.ALL : MappingState.UNMAPPED;

    let alphabetsFilter: string[] = [];
    let allAlphabets: boolean = true;

    if (this.form && !this.form.value.sourceUpdated) {
      allAlphabets = this.form.value.filterOption.length === this.filterOptions.length;

      if (!allAlphabets) {
        alphabetsFilter = this.form.value.filterOption;
      }
    }

    this.mappingService.getMappings(mappingState, allAlphabets, paginator.limit, paginator.offset, alphabetsFilter, this.mappingSetting.source_field, this.mappingSetting.destination_field).subscribe((extendedExpenseAttributeResponse: ExtendedExpenseAttributeResponse) => {
      this.totalCount = extendedExpenseAttributeResponse.count;
      extendedExpenseAttributeResponse.results.forEach((extendedExpenseAttribute: ExtendedExpenseAttribute, index: number) => {
        mappings.push({
          fyle: {
            id: extendedExpenseAttribute.id,
            value: extendedExpenseAttribute.value
          },
          qbo: {
            id: extendedExpenseAttribute.mapping.length ? extendedExpenseAttribute.mapping[0].destination.id : '',
            value: extendedExpenseAttribute.mapping.length ? extendedExpenseAttribute.mapping[0].destination.value : ''
          },
          state: extendedExpenseAttribute.mapping.length ? MappingState.MAPPED : MappingState.UNMAPPED,
          autoMapped: extendedExpenseAttribute.auto_mapped,
          index: index
        });
      });

      this.mappings = new MatTableDataSource(mappings);
      this.mappings.filterPredicate = this.searchByText;
      this.setupFyleQboMappingFormArray(mappings);

      // Reinitialize form when source type changes or when the component is loaded for first time
      if ((this.form && this.form.value.sourceUpdated) || !this.form) {
        this.setupForm();
      }

      this.isLoading = false;
    });
  }

  private searchByText(mapping: MappingList, filterText: string) {
    // TODO: update all searchByText with case insentitive
    return mapping.fyle.value.toLowerCase().includes(filterText.toLowerCase());
  }

  private getMappingsAndSetupPage(): void {
    this.sourceType = this.route.snapshot.params.source_field;
    forkJoin([
      this.mappingService.getMappingSettings(),
      this.mappingService.getMappingStats(this.sourceType.toUpperCase())
    ]).subscribe(responses => {
      this.mappingSetting = responses[0].results.filter((mappingSetting) => mappingSetting.source_field === this.sourceType.toUpperCase())[0];
      this.mappingStats = responses[1];

      this.mappingService.getQBODestinationAttributes(this.mappingSetting.destination_field).subscribe((qboData: DestinationAttribute[]) => {
        this.qboData = qboData;
        this.getMappings();
      });
    });
  }

  save(selectedRow: MappingList): void {
    const mappingPayload = MappingModel.constructPayload(this.mappingSetting, selectedRow);
    this.mappingService.postMapping(mappingPayload).subscribe(() => {

      if (selectedRow.state === MappingState.UNMAPPED) {
        this.mappingStats.unmapped_attributes_count -= 1;
        selectedRow.state = MappingState.MAPPED;
      }

      this.snackBar.open('Changes saved', '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'mapping-snackbar'
      });
    });

  }

  ngOnInit(): void {
    // Watch for changes in route, since this component is used for all mapping types
    this.route.params.subscribe(() => {
      this.isLoading = true;
      this.totalCardActive = true;

      // If source type is changed, reinitialize the form by maintaining sourceUpdated flag
      if (this.form) {
        this.form.controls.sourceUpdated.patchValue(true);
      }
      this.getMappingsAndSetupPage();
    });
  }

}
