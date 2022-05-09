import { Component, Input, OnInit } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-onboarding-footer',
  templateUrl: './onboarding-footer.component.html',
  styleUrls: ['./onboarding-footer.component.scss']
})
export class OnboardingFooterComponent implements OnInit {

  @Input() page: string;
  RedirectLink = RedirectLink;

  constructor() { }

  ngOnInit(): void {
  }

}
