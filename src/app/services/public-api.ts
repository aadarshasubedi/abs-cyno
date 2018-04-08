import { HTTP_JYEXCEPTION_DESC, HTTP_JYEXCEPTION_ANALYSIS } from '../../sdk/services/index';

import { HttpExceptionDescImpl } from './httpexception-desc';

export const BASE_PROVODERS = [
    {provide: HTTP_JYEXCEPTION_DESC, useClass: HttpExceptionDescImpl, multi: false}
];