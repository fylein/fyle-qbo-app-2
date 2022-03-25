import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Paginator } from 'src/app/core/models/misc/paginator.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  form: FormGroup;
  @Output() onPageChange = new EventEmitter<Paginator>();
  @Input() limit: number;
  @Input() offset: number;
  @Input() totalCount: number;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  private onPageSizeChangeWatcher(): void {
    this.form.controls.limit.valueChanges.subscribe(limit => {
      this.onPageChange.emit({
        limit: limit,
        offset: 0
      });
    });
  }

  onPageChangeHandler(event: 'CHANGE' | 'FORWARD' | 'BACKWARD'): void {
    if (event === 'CHANGE') {
      if (this.form.controls.page.value) {
        return this.onPageChange.emit({
          limit: this.limit,
          offset: (this.form.controls.page.value *  this.limit) - this.limit
        });
      } else {
        return;
      }
    }

    let offset: number = this.form.get('offset')?.value;
    if (event === 'FORWARD') {
      offset = this.form.get('offset')?.value + this.limit;
    } else if (event === 'BACKWARD') {
      offset = this.form.get('offset')?.value - this.limit;
    }

    if (event === 'BACKWARD' || event === 'FORWARD') {
      this.form.get('offset')?.setValue(offset);
    }

    this.onPageChange.emit({
      limit: this.form.get('limit')?.value,
      offset: offset
    });
  }

  private createWatchers(): void {
    this.onPageSizeChangeWatcher();
  }

  private setupForm(): void {
    this.limit = this.limit || 10;
    this.offset = this.offset || 0;
    this.totalCount = Math.ceil(this.totalCount / this.limit);
    const page = (this.offset / this.limit) + 1;

    this.form = this.formBuilder.group({
      limit: [this.limit],
      offset: [this.offset],
      page: [page]
    });

    this.createWatchers();
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
