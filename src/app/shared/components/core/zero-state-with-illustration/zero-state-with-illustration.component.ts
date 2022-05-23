import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectedDateFilter } from 'src/app/core/models/misc/date-filter.model';

@Component({
  selector: 'app-zero-state-with-illustration',
  templateUrl: './zero-state-with-illustration.component.html',
  styleUrls: ['./zero-state-with-illustration.component.scss']
})
export class ZeroStateWithIllustrationComponent implements OnInit {

  // Having any here is okay, we get the data from the export log / mapping module
  @Input() data: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @Input() form: FormGroup;

  @Input() searchTerm: string;

  @Input() page: 'export_log' | 'mapping' | 'dashboard' | 'dashboard_error';

  @Input() dateFilter: SelectedDateFilter | null;

  constructor() { }

  ngOnInit(): void {
  }

}
