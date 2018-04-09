import { Directive, StaticProvider, forwardRef } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

declare const validator: any;

export const JY_NUMBER_VALIDATOR: StaticProvider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => JyNumberValidator),
    multi: true
  };

@Directive({
    selector: '[jyNumber]',
    providers: [JY_NUMBER_VALIDATOR]
})
export class JyNumberValidator implements Validator {

    private _onChange: () => void;

    validate(c: AbstractControl): ValidationErrors|null {
        const _v = c.value + '';
        if (_v === null || _v === undefined || _v === '' || validator.isNumeric(_v)) {
            return null;
        }
        return {'jyNumber': true};
    }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }
 }