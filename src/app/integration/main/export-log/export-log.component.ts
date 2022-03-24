import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  dataSource = [
    {exportedAt: new Date(), name: 'Hydrogen', fundSource: 'Credit Card', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
  ];
  displayedColumns: string[];
  isLoading: boolean = true;
  exportLogForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  openInQBO(url: string): void {
    // TODO
  }

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: ['']
    })
  }

  ngOnInit(): void {
    this.dataSource = [
      {exportedAt: new Date(), name: 'Hydrogen', fundSource: 'Credit Card', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Helium', fundSource: 'Credit Card', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Lithium', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Beryllium', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Boron', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Helium', fundSource: 'Credit Card', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Lithium', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Beryllium', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Boron', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Helium', fundSource: 'Credit Card', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Lithium', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Beryllium', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'},
      {exportedAt: new Date(), name: 'Boron', fundSource: 'Reimbursable', referenceID: '#E/123/23R35', exportType: 'Bill', link: 'https://ashwin.ashwin'}
    ];
    this.displayedColumns = ['exportedAt', 'name', 'fundSource', 'referenceID', 'exportType', 'link'];
    this.setupForm();    
    
    this.isLoading = false;
  }

}
