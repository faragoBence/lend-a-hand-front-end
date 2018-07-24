import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Ad} from './ad.model';
import {User} from './user.model';
import {Filter} from './filter.model';

@Injectable({
    providedIn: 'root'
})
export class GlobalEventManagerService {

    private filterTrigger: Subject<Filter> = new BehaviorSubject<Filter>(null);
    public filterEmitter: Observable<Filter> = this.filterTrigger.asObservable();

    private singleAdTrigger: Subject<Ad> = new BehaviorSubject<Ad>(null);
    public singleAdEmitter: Observable<Ad> = this.singleAdTrigger.asObservable();

    private userTrigger: Subject<User> = new BehaviorSubject<User>(null);
    public userEmitter: Observable<User> = this.userTrigger.asObservable();

    public profileEmitter: Observable<User> = this.userTrigger.asObservable();
    private profileTrigger: Subject<User> = new BehaviorSubject<User>(null);

 

    public updateFilter(filter: Filter): void {
        this.filterTrigger.next(filter);
    }


    public updateSingleAd(ad: Ad): void {
        this.singleAdTrigger.next(ad);
        console.log(ad.title);
    }

    public updateUser(user: User): void {
        this.userTrigger.next(user);
    }

    public updateProfile(user: User): void {
        this.profileTrigger.next(user);
    }

    constructor() {
    }
}
