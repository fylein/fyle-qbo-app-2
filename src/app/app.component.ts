import { Component } from '@angular/core';
var a=''; // <-- fail lint check
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
