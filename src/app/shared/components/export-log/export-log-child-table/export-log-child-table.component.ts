import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseList } from 'src/app/core/models/db/expense.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-export-log-child-table',
  templateUrl: './export-log-child-table.component.html',
  styleUrls: ['./export-log-child-table.component.scss']
})
export class ExportLogChildTableComponent implements OnInit {

  @Input() expenses: MatTableDataSource<ExpenseList> = new MatTableDataSource<ExpenseList>([]);
  @Input() displayedColumns: string[];

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

}
