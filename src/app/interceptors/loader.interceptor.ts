import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {NgxUiLoaderService} from "ngx-ui-loader";
import {finalize, Observable} from "rxjs";
import {Injectable} from "@angular/core";
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: NgxUiLoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.startLoader("master");

    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.stopLoader("master");
      })
    );
  }
}
