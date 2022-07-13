import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

// Custom email validator
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[emailValidateDirective]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: EmailValidateDirective,
    multi: true
  }]
})
export class EmailValidateDirective implements Validator {
  validate(control: AbstractControl): {[key: string]: boolean} | null {
    const emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})$/;
    if (control.value && emailCheck.test(control.value) === false) {
      return { emailInvalid: true }; // if validation is not passed
    }
    return null; // if validation is passed
  }
}
