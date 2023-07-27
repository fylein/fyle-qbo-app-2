import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() formControllerName: string;

  @Input() isCloneSettings: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
