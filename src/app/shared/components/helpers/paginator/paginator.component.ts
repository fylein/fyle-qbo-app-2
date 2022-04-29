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
  @Output() pageChangeEvent = new EventEmitter<Paginator>();
  @Input() limit: number;
  @Input() offset: number;
  @Input() totalCount: number;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  private onPageSizeChangeWatcher(): void {
    this.form.controls.pageLimit.valueChanges.subscribe(limit => {
      this.pageChangeEvent.emit({
        limit: limit,
        offset: 0,
        pageSizeChange: true
      });
    });
  }

  onPageChangeHandler(event: 'CHANGE' | 'FORWARD' | 'BACKWARD'): void {
    if (event === 'CHANGE') {
      if (this.form.controls.page.value) {
        if (this.form.controls.page.value > this.totalCount || this.form.controls.page.value < 1) {
          return;
        }
        return this.pageChangeEvent.emit({
          limit: this.limit,
          offset: (this.form.controls.page.value *  this.limit) - this.limit
        });
      } else {
        return;
      }
    }

    let offset: number = this.form.get('offset')?.value;
    if (event === 'FORWARD') {
      if (this.form.value.page >= this.totalCount) {
        return;
      }
      offset = this.form.get('offset')?.value + this.limit;
    } else if (event === 'BACKWARD') {
      if (this.form.value.page <= 1) {
        return;
      }
      offset = this.form.get('offset')?.value - this.limit;
    }

    if (event === 'BACKWARD' || event === 'FORWARD') {
      this.form.get('offset')?.setValue(offset);
    }

    this.pageChangeEvent.emit({
      limit: this.form.get('pageLimit')?.value,
      offset: offset
    });
  }

  private createWatchers(): void {
    this.onPageSizeChangeWatcher();
  }

  private setupForm(): void {
    this.limit = this.limit || 50;
    this.offset = this.offset || 0;
    this.totalCount = Math.ceil(this.totalCount / this.limit);
    const page = (this.offset / this.limit) + 1;

    this.form = this.formBuilder.group({
      pageLimit: [this.limit],
      offset: [this.offset],
      page: [page]
    });

    this.createWatchers();
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
