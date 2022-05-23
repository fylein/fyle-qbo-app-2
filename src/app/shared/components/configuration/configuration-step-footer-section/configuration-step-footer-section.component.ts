import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigurationCtaText } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-configuration-step-footer-section',
  templateUrl: './configuration-step-footer-section.component.html',
  styleUrls: ['./configuration-step-footer-section.component.scss']
})
export class ConfigurationStepFooterSectionComponent implements OnInit {

  @Input() isButtonDisabled: boolean;

  @Input() ctaText: ConfigurationCtaText;

  @Input() showBackButton: boolean;

  @Output() save = new EventEmitter();

  @Output() navigateToPreviousStep = new EventEmitter();

  constructor() { }

  navigate(): void {
    this.navigateToPreviousStep.emit();
  }

  saveChanges(): void {
    this.save.emit();
  }

  ngOnInit(): void {
  }

}
