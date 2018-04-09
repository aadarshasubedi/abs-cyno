import { SimpleChanges, Directive, StaticProvider, forwardRef, Input, OnChanges } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

declare const validator: any;

export const JY_MIN_VALIDATOR: StaticProvider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => JyMinValidator),
    multi: true
  };

@Directive({
    selector: '[jyMin]',
    providers: [JY_MIN_VALIDATOR]
})
export class JyMinValidator implements Validator, OnChanges {

    @Input('jyMin') min: any;

    private _onChange: () => void;

    validate(c: AbstractControl): ValidationErrors|null {
        const _v = c.value + '';
        if (validator.isFloat(this.min + '')) {
            return _v < this.min ? {'jyMin': {max: this.min}} : null;
        }
        return null;
    }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

    ngOnChanges(changes: SimpleChanges): void {
        if ('jyMin' in changes) {
          if (this._onChange) {
                this._onChange();
          }
        }
    }
 }