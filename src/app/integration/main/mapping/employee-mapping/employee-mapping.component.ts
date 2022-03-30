import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AutoMapEmployee } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-employee-mapping',
  templateUrl: './employee-mapping.component.html',
  styleUrls: ['./employee-mapping.component.scss']
})
export class EmployeeMappingComponent implements OnInit {

  totalCardActive: boolean = true;
  // TODO: update this
  autoMapEmployee: AutoMapEmployee = AutoMapEmployee.NAME;
  isLoading: boolean = true;
  // TODO: update this any
  mappings: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['fyle', 'qbo', 'state'];

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  triggerAutoMapEmployee(): void {
    // TODO: trigger auto map employee
  }

  private setupForm(): void {
    this.form = this.formBuilder.group({
      map: ['']
    });
  }

  ngOnInit(): void {
    this.isLoading = false;
    const mappings = [
      {
        fyle: 'John Doe',
        qbo: 'John Doe',
        state: 'Mapped'
      },
      {
        fyle: 'John Doe',
        qbo: 'John Doe',
        state: 'Mapped'
      }
    ];
    this.mappings = new MatTableDataSource(mappings);
    this.setupForm();
  }

}
