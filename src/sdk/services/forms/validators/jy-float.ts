import { Directive, StaticProvider, forwardRef } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

declare const validator: any;

export const JY_FLOAT_VALIDATOR: StaticProvider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => JyFloatValidator),
    multi: true
  };

@Directive({
    selector: '[jyFloat]',
    providers: [JY_FLOAT_VALIDATOR]
})
export class JyFloatValidator implements Validator {

    private _onChange: () => void;

    validate(c: AbstractControl): ValidationErrors|null {
        const _v = c.value + '';
        if (_v === null || _v === undefined || _v === '' || validator.isNumeric(_v) || validator.isFloat(_v)) {
            return null;
        }
        return {'jyFloat': true};
    }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }
 }