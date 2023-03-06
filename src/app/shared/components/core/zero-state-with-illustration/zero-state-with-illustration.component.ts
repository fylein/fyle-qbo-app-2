import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { RedirectLink, ZeroStatePage } from 'src/app/core/models/enum/enum.model';
import { SelectedDateFilter } from 'src/app/core/models/misc/date-filter.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-zero-state-with-illustration',
  templateUrl: './zero-state-with-illustration.component.html',
  styleUrls: ['./zero-state-with-illustration.component.scss']
})
export class ZeroStateWithIllustrationComponent implements OnInit {

  // Having any here is okay, we get the data from the export log / mapping module
  @Input() data: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @Input() form: UntypedFormGroup;

  @Input() searchTerm: string;

  @Input() page: ZeroStatePage;

  @Input() dateFilter: SelectedDateFilter | null;

  RedirectLink = RedirectLink;

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

}
