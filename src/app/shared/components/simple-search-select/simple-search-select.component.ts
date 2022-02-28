import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-simple-search-select',
  templateUrl: './simple-search-select.component.html',
  styleUrls: ['./simple-search-select.component.scss']
})
export class SimpleSearchSelectComponent implements OnInit {

  simpleSearchForm: FormGroup;
  @Output() filterOptions = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder
  ) { }

  private createSearchTextWatcher(): void {
    this.simpleSearchForm.controls.searchText.valueChanges.subscribe((searchText: string) =>{
      this.filterOptions.emit(searchText);
    });
  }

  private setupForm(): void {
    this.simpleSearchForm = this.formBuilder.group({
      searchText: ['']
    });

    this.createSearchTextWatcher();
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
