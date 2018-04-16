import { SimpleChanges, Directive, StaticProvider, forwardRef, Input, OnChanges } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

declare const validator: any;

export const JY_MAX_VALIDATOR: StaticProvider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => JyMaxValidator),
    multi: true
  };

@Directive({
    selector: '[jyMax]',
    providers: [JY_MAX_VALIDATOR]
})
export class JyMaxValidator implements Validator, OnChanges {

    @Input('jyMax') max: any;

    private _onChange: () => void;

    validate(c: AbstractControl): ValidationErrors|null {
        const _v = c.value + '';
        if (validator.isFloat(this.max + '')) {
            return (+_v) > (+this.max) ? {'jyMax': {max: this.max}} : null;
        }
        return null;
    }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

    ngOnChanges(changes: SimpleChanges): void {
        if ('jyMax' in changes) {
          if (this._onChange) {
                this._onChange();
          }
        }
    }
 }