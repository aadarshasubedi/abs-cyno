import { Directive, StaticProvider, forwardRef, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

declare const validator: any;

export const JY_FUNC_VALIDATOR: StaticProvider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => JyFuncValidator),
    multi: true
  };

@Directive({
    selector: '[jyFunc]',
    providers: [JY_FUNC_VALIDATOR]
})
export class JyFuncValidator implements Validator {

    @Input('jyFunc') func: any;

    private _onChange: () => void;

    validate(c: AbstractControl): ValidationErrors|null {
        const r = typeof this.func === 'function' && this.func(c.value);
        return typeof r === 'string' ?  {'jyVFunc': r} : null;
    }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }
 }