import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding-footer',
  templateUrl: './onboarding-footer.component.html',
  styleUrls: ['./onboarding-footer.component.scss']
})
export class OnboardingFooterComponent implements OnInit {

  @Input() page: string;

  constructor() { }

  ngOnInit(): void {
  }

}
