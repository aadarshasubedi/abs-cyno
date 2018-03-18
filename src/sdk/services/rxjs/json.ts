import { Observable} from 'rxjs/Observable';
import { Subscriber} from 'rxjs/Subscriber';
import { MapOperator} from 'rxjs/operators/map';

/**
 * @author xiufu.wang
 */
export function jsonMap<T>(findBody?: (source: T) => string) {

    return function jsonMapOperation(source: Observable<Object>){
        return source.lift(new JsonOperator<T>(findBody));
    }
}

class JsonOperator<T> extends MapOperator<T, any> {

    constructor(private findBody: (source: T) => string) {
        super(null, null);
    }

    call(subscriber: Subscriber<T>, source: any): any {
        return source.subscribe(new JsonMapSubscriber<T>(subscriber, this.findBody));
    }

}

class JsonMapSubscriber<T> extends Subscriber<T> {

    constructor(destination: Subscriber<T>, private findBody: (source: T) => string) {
        super(destination);
    }

    protected _next(value: T) {
        let str: any  = value;
        try {
            if (this.findBody && typeof this.findBody === 'function'){
                str = this.findBody(str);
            }
          if (typeof str === 'string') {
            this.destination.next(JSON.parse(str));
            return;
          }
          if (typeof str === 'object') {
            this.destination.next(str);
            return;
          }
        } catch (err) {
          this.destination.error(value);
          return;
        }
     }
}
