import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Modal} from 'bootstrap';
import {SpinnerService} from "./shared/services/spinner.service";
import {UserService} from "./shared/services/user.service";
import {SubmitFormResponseData} from "./shared/interface/responses";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  @ViewChild('confirmModal') confirmModal = {} as ElementRef;
  @ViewChild('infoModal') infoModal = {} as ElementRef;

  submitted = false;
  cancelTimeLimit = 5;
  maxFormsLimit = 10;
  timerCount = 0;
  timer: any;
  userFormsArray: FormGroup[] = [];
  formIndexToDelete: number | null = null;

  constructor(
    private userService: UserService,
    public spinnerService: SpinnerService) {
  }

  get isSubmitDisabled(): boolean {
    return this.userFormsArray.length === 0 ||
      this.invalidFormsCount > 0 ||
      this.spinnerService.getSpinner().value;
  }

  get invalidFormsCount(): number {
    return this.userFormsArray.filter(form => form.invalid).length;
  }

  submitAllForms() {
    this.userFormsArray.forEach(form => form.disable());
    this.timerCount = this.cancelTimeLimit;
    this.submitted = true;
    this.timer = setInterval(() => {
      this.timerCount--;
      if (this.timerCount < 0) {
        this.submitted = false;
        clearInterval(this.timer);
        this.doSubmitAllForms();
      }
    }, 1000);
  }

  cancelSubmit() {
    this.submitted = false;
    clearInterval(this.timer);
    this.userFormsArray.forEach(form => form.enable());
    this.spinnerService.hide();
  }

  addForm() {
    if (this.userFormsArray.length < this.maxFormsLimit) {
      const newForm = new FormGroup({
        country: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        birthday: new FormControl('', Validators.required),
      });

      this.userFormsArray.push(newForm);
    } else {
      const modal = new Modal(this.infoModal.nativeElement);
      modal.show();
    }
  }

  confirmDeleteFormModal(index: number) {
    const modal = new Modal(this.confirmModal.nativeElement);
    this.formIndexToDelete = index;
    modal.show();
  }

  deleteFormModal() {
    if (this.formIndexToDelete !== null) {
      this.userFormsArray.splice(this.formIndexToDelete, 1);
      this.formIndexToDelete = null;
    }
  }

  doSubmitAllForms() {
    const formsData = this.userFormsArray.map(form => form.value);
    this.userService.addUsers(formsData).subscribe((res: SubmitFormResponseData) => {
      console.log(res);
      this.userFormsArray.forEach(form => {
        form.enable();
        form.reset()
      });
      this.spinnerService.hide();
    }, error => {
      console.error('Error: ', error);
      this.spinnerService.hide();
    });

  }

}
