import {Directive, ElementRef, HostListener} from '@angular/core';
import {FormControl, NgControl} from '@angular/forms';
import {Country} from "../enum/country";
import {debounceTime, filter, Subscription, switchMap, tap} from "rxjs";
import {UserService} from "../services/user.service";
import {SpinnerService} from "../services/spinner.service";

@Directive({
  selector: '[appInputValidator]',
  standalone: true
})
export class InputValidatorDirective {
  usernameSubscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private control: NgControl,
    private userService: UserService,
    public spinnerService: SpinnerService
  ) {
  }

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement.value;
    if (this.control.errors) {
      return;
    }

    switch (this.control.name) {
      case 'country': {
        const isInclude = Object.values(Country).includes(input);
        if (!isInclude) {
          this.control.control?.setErrors({notInclude: true});
        }
        break;
      }
      case 'birthday': {
        const isValidDate = input && new Date(input) < new Date();
        if (!isValidDate) {
          this.control.control?.setErrors({invalidDate: true});
        }
        break;
      }
    }

  }

  @HostListener('blur') onBlur(): void {
    if (this.control.name === 'username') {
      this.usernameSubscription.unsubscribe();
    }
  }

  @HostListener('focus') onFocus(): void {
    if (this.control.name === 'username') {
      const usernameControl: FormControl = this.control.control as FormControl;
      this.usernameSubscription = usernameControl.valueChanges.pipe(
        filter(value => value && value.length),
        tap(() => this.spinnerService.show()),
        debounceTime(500),
      ).pipe(
        switchMap(value => this.userService.checkUser(value)),
      ).subscribe(response => {
        this.control.control?.setErrors(response.isAvailable ? null : {notAvailable: {value: usernameControl.value}});
        this.spinnerService.hide();
      });
    }
  }

}
