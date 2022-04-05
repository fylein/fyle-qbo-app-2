import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor() { }

  ngOnInit(): void {
  }

}
