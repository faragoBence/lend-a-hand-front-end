import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ad} from '../model/ad.model';
import {GlobalEventManagerService} from '../service/global-event-manager.service';
import {Router} from '@angular/router';
import {User} from '../model/user.model';
import {Subscription} from 'rxjs';
import {UserService} from '../service/user.service';
import {ApplicationService} from '../application.service';



@Component({
    selector: 'app-single-ad',
    templateUrl: './single-ad.component.html',
    styleUrls: ['./single-ad.component.css']
})


export class SingleAdComponent implements OnInit, OnDestroy {
    ad: Ad;
    user: User;
    singleAdSub: Subscription;
    ownAd: boolean;
    applicationMessage:string;

    constructor(private gem: GlobalEventManagerService, private router: Router, private userService: UserService,private appService:ApplicationService) {
    }

    ngOnInit() {
        if (sessionStorage.getItem('user') !== null) {
            this.user = JSON.parse(sessionStorage.getItem('user'));
            this.gem.updateUser(this.user);
        }

        this.singleAdSub = this.gem.singleAdEmitter.subscribe(ad => {
            if (ad) {
                sessionStorage.setItem('ad', JSON.stringify(ad));
                this.ad = ad;
            } else {
                this.ad = JSON.parse(sessionStorage.getItem('ad'));
            }
        });

        if (sessionStorage.getItem('user') !== null) {
            if (this.ad.advertiserId === this.user.id) {
                this.ownAd = true;
            } else {
                this.ownAd = false;
            }
        } else {
            this.ownAd = false;
        }

    }

    toProfile(userId) {
        this.userService.getUserById(userId).subscribe(user => {
            this.gem.updateProfile(user);
            this.router.navigate(['profile']);
        }, error => {
            console.log(error);
        });
    }

    applyToAd(){
        document.getElementById("applicationMessageDiv").classList.remove("hidden");
    }

    sendApplication(){
        this.appService
    }

    ngOnDestroy() {
        this.singleAdSub.unsubscribe();
    }


}
