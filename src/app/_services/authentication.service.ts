import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import 'rxjs/add/observable/of';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    isAuthincate: boolean = false;
    public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router
        ) {
        // this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        if (Cookie.check('.PM.Cookie'))
            this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.PM.Cookie')));
    }

    public get currentUserValue(): any {
        return Cookie.check('.PM.Cookie') ? this.currentUserDetails.value : null;
    }

    public isAuthenticated(): boolean {
        return Cookie.check('.PM.Cookie');
    }

    login(params) {
        const obj = {
            email: params.UserName,
            password: params.Password
        };

        return this.http.post<any>(environment.baseUrl + 'login', obj).pipe(map(data => {
            if(!data.success){
                const res = {
                    data: {},
                    errors: null,
                    message: data.error,
                    success: false
                };
                return res;
            }else{
                const user = {
                    id: data.data.id,
                    email: data.data.email,
                    first_name: data.data.name,
                    last_name: data.data.name,
                    full_name: data.data.name,
                    user_type: data.data.user_type,
                    role: data.data.user_type,
                    access_token: data.data.token,
                    //image: data.user.image,
                    created: data.data.updated_at,
                }

                console.log(user)
    
                let expireDate = new Date('2030-07-19');
                Cookie.set('.PM.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
                this.currentUserDetails.next(user);
                const res = {
                    data: user,
                    errors: null,
                    message: "",
                    success: true
                };
                return res;
            }
        }),
            catchError(err => {
                return of(err);
            }));
    }

    logout(hostname) {
        return this.http.post<any>(environment.baseUrl + '/logout', {}).pipe(
            map(res => {
                if (res.success) {
                    this.isAuthincate = false;
                    Cookie.delete('.PM.Cookie', '/', hostname);
                    this.toastr.success(res.message, 'Success!', { timeOut: 2000 });
                    this.currentUserDetails.next(null);
                    this.router.navigate(['/login']);
                }
                return res;
            })
        );

    }

    registerSystemAdmin(url, params) {
        return this.http.post<any>(environment.apiUrl + url, params).pipe(
            map(res => {
                return res;
            })
        );
    }

}
