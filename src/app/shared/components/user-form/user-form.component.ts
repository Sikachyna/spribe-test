import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Country} from "../../enum/country";
import {NgClass, NgForOf, NgIf, NgSwitch} from "@angular/common";
import {InputValidatorDirective} from "../../directives/input-validator.directive";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass,
    NgSwitch,
    InputValidatorDirective
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})

export class UserFormComponent {
  @Input() form: FormGroup = new FormGroup({});
  @Input() formIndex: number | undefined;
  @Output() onCloseForm: EventEmitter<number> = new EventEmitter();
  countries: string[] = Object.values(Country);

  closeForm() {
    this.onCloseForm.emit(this.formIndex);
  }

}
