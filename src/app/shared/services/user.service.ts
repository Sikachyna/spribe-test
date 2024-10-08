import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CheckUserResponseData, SubmitFormResponseData} from "../interface/responses";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) {
  }

  checkUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', {username});
  }

  addUsers(user: any): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', user);
  }

}
