import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SkipExportList } from 'src/app/core/models/db/expense-group.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-skip-export-log-table',
  templateUrl: './skip-export-log-table.component.html',
  styleUrls: ['./skip-export-log-table.component.scss']
})
export class SkipExportLogTableComponent implements OnInit {

  @Input() displayedColumns: string[] = [];

  @Input() skipExport: MatTableDataSource<SkipExportList> = new MatTableDataSource<SkipExportList>([]);

  // Disable opening of child expenses when this component is used in dashboard export dialog
  @Input() allowChildViewing: boolean = true;

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

}
