import {Inject, Injectable, Optional} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {TransferStateService} from "../services/transfer-state.service";
import {Observable, of} from "rxjs";
import {tap} from "rxjs/operators";
import {REQUEST} from "@nguniversal/express-engine/tokens";

@Injectable()
export class TransferStateInterceptor implements HttpInterceptor {
  constructor(private transferStateService: TransferStateService,
              @Optional() @Inject(REQUEST) private httpRequest:any) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.httpRequest) //If optional request is provided, we are server side
    {
      req = req.clone(
        {
          setHeaders:
            {
              Cookie: this.httpRequest.headers.cookie
            }
        });
    }
    /**
     * Skip this interceptor if the request method isn't GET.
     */
    if (req.method !== 'GET' || req.urlWithParams == '/api/user') {
      return next.handle(req);
    }

    const cachedResponse = this.transferStateService.get(req.urlWithParams.split("/api").pop()!);
    if (cachedResponse) {
      // A cached response exists which means server set it before. Serve it instead of forwarding
      // the request to the next handler.
      return of(new HttpResponse<any>({ body: cachedResponse }));
    }



    /**
     * No cached response exists. Go to the network, and cache
     * the response when it arrives.
     */
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.transferStateService.set(req.urlWithParams.split("/api").pop()!, event.body);
        }
      })
    );
  }
}
