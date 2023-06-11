import { HttpInterceptor, HttpRequest, HttpHeaders,  } from "@angular/common/http";
import { HttpEvent, HttpHandler, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { from } from "rxjs";
import { EMPTY } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
// import { ToastrService } from "ngx-toastr";
import { TokenManagerService } from "@common/services/TokenManagerService";
import { environment } from "src/environments/environment";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    refreshTokenEndPoint: string;

    constructor(private httpClient: HttpClient, private router: Router,
        private tokenManagerService: TokenManagerService) {
        this.refreshTokenEndPoint = environment.API_ENDPOINT + "auth/refreshToken";
    }

    async addHeaders(request: any) {
        const headerParams: any = {};
        // if ((!request.url.endsWith("upload/logger")) && (!request.url.endsWith("update/asset"))) {
        //     headerParams["Content-Type"] = "application/json";
        // }
        const token = await this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.MY_TOKEN);
        if (token != null) {
            headerParams["Authorization"] = "Bearer " + token;
        }
        return new Promise((resolve, reject) => {
            const headers = new HttpHeaders(headerParams);
            return resolve(request.clone({ headers }));
        });
    }

    async getTokens() {
        const token = await this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.MY_TOKEN);
        const refreshToken = await this.tokenManagerService.getItemFromSessionStorage(environment.SESSION_ATTRIBUTES.MY_REFRESH_TOKEN);
        return new Promise(function (resolve, reject) {
            return resolve({ token: token, refreshToken: refreshToken });
        });
    }

    fetchRefreshTokens(token: any, refreshToken: any): Observable<any> {
        return this.httpClient.post(this.refreshTokenEndPoint, { token: token, refreshToken: refreshToken });
    }

    refreshToken() {
        const _self = this;
        return new Promise(function (resolve, reject) {
            _self.getTokens().then((tokenInfo: any) => {
                const token = tokenInfo["token"];
                const refreshToken = tokenInfo["refreshToken"];
                _self.fetchRefreshTokens(token, refreshToken)
                    .subscribe({
                        next: (body) => {
                            _self.tokenManagerService.setItemToSessionStorage("myToken", body["token"]);
                            _self.tokenManagerService.setItemToSessionStorage("myRefreshToken", body["refreshToken"]);
                            return resolve(true);
                        },
                        error: (err) => {
                            return reject(err);
                        }
                    }
                    );
            });
        });

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.addHeaders(req)).pipe(mergeMap((clonedReq: any) => {
            return next.handle(clonedReq).pipe(map(resp => resp), catchError(error => {
                if (error.status === 401
                    && !error.url.endsWith("refreshToken")
                    && error.error !== null
                    && error.error.code === "TokenExpiredError") {
                    return from(this.refreshToken()).pipe(mergeMap(() => {
                        return from(this.addHeaders(req)).pipe(mergeMap((clonedRequest: any) => {
                            return next.handle(clonedRequest);
                        }));
                    }), catchError(err => {
                        this.handleError(err);
                        return EMPTY;
                    }));
                } else {
                    this.handleError(error);
                    return EMPTY;
                }
            }));
        }
        ));
    }

    handleError(error: any) {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
                return throwError(()=>(error));
            } else if (error.status >= 500) {
                console.log("server error");
                
                // this.router.navigate(["/server-error"]);
            } else if (error.status === 400) {
                const msg = error.error.message;
                const statusCode = error.error.statusCode;
                // this.toastr.warning(msg, statusCode, { closeButton: true });
                // return Observable.throw(error);
            } else {
                console.log("in else");
                console.log(error);
                // this.router.navigate(["/error", { "errMessage": error.statusText, "errStatus": error.status }]);
            }
        } else {
            // this.router.navigate(["/error", { "errMessage": "Internal Server Error" }]);
            console.log(error);
        }
    }
}
