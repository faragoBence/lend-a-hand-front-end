import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    constructor(private http: HttpClient) {
    }

    sendApplication(application): Observable<any> {
        return this.http.post('/api/applications/new', application);
    }

    getApplicationsByApplicantId(applicantId): Observable<any> {
        return this.http.get('api/applications/applicants/' + applicantId);
    }

    getApplicationsByAd(adId) : Observable<any>{
        return this.http.get('/api/applications/ads/'+adId);
    }
}
