import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClickEvent, PaginatorPage, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { Paginator } from 'src/app/core/models/misc/paginator.model';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  form: FormGroup;

  totalPageCount: number;

  @Output() pageChangeEvent = new EventEmitter<Paginator>();

  @Input() limit: number;

  @Input() offset: number;

  @Input() totalCount: number;

  @Input() page: PaginatorPage;

  constructor(
    private formBuilder: FormBuilder,
    private trackingService: TrackingService
  ) { }

  private onPageSizeChangeWatcher(): void {
    this.form.controls.pageLimit.valueChanges.subscribe(limit => {
      this.trackingService.onUpdateEvent(
        UpdateEvent.PAGE_SIZE,
        {
          page: this.page,
          oldState: this.limit,
          newState: limit
        }
      );
      this.pageChangeEvent.emit({
        limit: limit,
        offset: 0
      });
    });
  }

  onPageChangeHandler(event: 'CHANGE' | 'FORWARD' | 'BACKWARD'): void | false {
    const eventName: ClickEvent = this.page === PaginatorPage.EXPORT_LOG ? ClickEvent.EXPORT_LOG_PAGE_NAVIGATION : ClickEvent.MAPPING_PAGE_NAVIGATION;
    if (event === 'CHANGE') {
      if (this.form.controls.page.value) {
        if (this.form.controls.page.value > this.totalPageCount || this.form.controls.page.value < 1) {
          return false;
        }
        return this.pageChangeEvent.emit({
          limit: this.limit,
          offset: (this.form.controls.page.value *  this.limit) - this.limit
        });
      }

      return false;
    }

    let offset: number = this.form.get('offset')?.value;
    const currentPage = this.form.value.page;
    let newPage: number = 0;
    if (event === 'FORWARD') {
      if (this.form.value.page >= this.totalPageCount) {
        return false;
      }
      newPage = currentPage + 1;
      offset = this.form.get('offset')?.value + this.limit;
    } else if (event === 'BACKWARD') {
      if (this.form.value.page <= 1) {
        return false;
      }
      newPage = currentPage - 1;
      offset = this.form.get('offset')?.value - this.limit;
    }
    this.trackingService.onClickEvent(eventName, {previousPageNumber: currentPage, newPageNumber: newPage});

    if (event === 'BACKWARD' || event === 'FORWARD') {
      this.form.get('offset')?.setValue(offset);
      this.form.get('page')?.setValue(newPage);
    }

    this.pageChangeEvent.emit({
      limit: this.form.get('pageLimit')?.value,
      offset: offset
    });

    return false;
  }

  private createWatchers(): void {
    this.onPageSizeChangeWatcher();
  }

  private setupForm(): void {
    this.limit = this.limit || 50;
    this.offset = this.offset || 0;
    this.totalPageCount = Math.ceil(this.totalCount / this.limit);
    const page = (this.offset / this.limit) + 1;

    this.form = this.formBuilder.group({
      pageLimit: [this.limit],
      offset: [this.offset],
      page: [page]
    });

    this.createWatchers();
  }

  ngOnChanges(): void {
    this.setupForm();
  }

  ngOnInit(): void {
    this.setupForm();
  }

}
