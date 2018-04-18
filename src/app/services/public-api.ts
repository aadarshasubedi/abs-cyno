import { HTTP_JYEXCEPTION_DESC, HTTP_JYEXCEPTION_ANALYSIS } from '../../sdk/services/index';
import { AuthGuard } from './auth-guard';
import { HttpExceptionDescImpl } from './httpexception-desc';

export const BASE_PROVODERS = [
    AuthGuard,
    {provide: HTTP_JYEXCEPTION_DESC, useClass: HttpExceptionDescImpl, multi: false}
];