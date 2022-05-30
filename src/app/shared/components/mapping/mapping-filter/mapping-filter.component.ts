import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-mapping-filter',
  templateUrl: './mapping-filter.component.html',
  styleUrls: ['./mapping-filter.component.scss']
})
export class MappingFilterComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() searchTerm: string;

  filterOptions: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  @Output() mappingFilterUpdateHandler = new EventEmitter<{}>();

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor() { }

  addAllFilterHandler(): void {
    this.form.controls.filterOption.patchValue([]);

    this.mappingFilterUpdateHandler.emit({});
  }

  filterOptionUpdateHandler(alphabet: string): void {
    const index = this.form.value.filterOption.indexOf(alphabet);

    if (index > -1) {
      this.form.value.filterOption.splice(index, 1);
    } else {
      this.form.value.filterOption.push(alphabet);
    }

    this.mappingFilterUpdateHandler.emit({});
  }

  ngOnInit(): void {
  }

}
