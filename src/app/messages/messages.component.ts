import {Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalEventManagerService} from '../service/global-event-manager.service';
import {User} from '../model/user.model';
import {MessageService} from '../service/message.service';
import {Contact} from '../model/contact.model';
import {Message} from '../model/message.model';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';
import {AdService} from '../service/ad.service';
import {ApplicationService} from '../service/application.service';
import {UserContact} from '../model/user-contact.model';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
    user: User;
    contacts: Contact[];
    activeContacts: Contact[];
    activeContact: Contact;
    loaded = false;
    error: string;

    constructor(private gem: GlobalEventManagerService, private messageService: MessageService,
                private userService: UserService, private adService: AdService, private router: Router,
                private applicationService: ApplicationService) {
    }

    ngOnInit() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.gem.updateUser(this.user);
        this.messageService.getContactsByUserId(this.user.id).subscribe(response => {
            this.contacts = response;
            if (this.contacts.length !== 0) {
                this.activeContact = this.contacts[0];
                this.readMessages();
            } else {
                this.loaded = true;
            }
        }, error => {
            this.handleError(error);
        });
        setInterval(this.getNewMessages.bind(this), 3000);
    }


    getNewMessages() {
        if (this.user) {
            this.messageService.haveNewMessages(this.user.id).subscribe(boolean => {
                if (boolean) {
                    this.messageService.getNewMessages(this.user.id, this.activeContact.user.id, this.activeContact.lastMessage.id).subscribe(newMessages => {
                        for (const e of <any>newMessages) {
                            this.activeContact.messages.push(<Message>e);
                            this.activeContact.lastMessage = this.activeContact.messages[this.activeContact.messages.length - 1];
                        }
                        setTimeout(this.scrollDown, 50);
                    }, error => {
                        this.handleError(error);
                    });
                }
            }, error => {
                this.handleError(error);
            });
        }
    }

    readMessages() {
        const dto = new UserContact();
        dto.user = this.user;
        dto.contact = this.activeContact;
        this.messageService.readMessages(dto).subscribe(contacts => {
            this.contacts = contacts;
            this.activeContacts = this.contacts;
            this.activeContact.ad.formattedTitle = this.formatAdTitle(this.activeContact.ad.title);
            this.loaded = true;
            setTimeout(this.scrollDown, 50);
        }, error => {
            this.handleError(error);
        });
    }

    formatAdTitle(title: string): string {
        let formattedTitle;
        if (title.length > 11) {
            formattedTitle = title.substring(0, 11) + '...';
        } else {
            formattedTitle = title;
        }
        return formattedTitle;
    }

    standByAd(id) {
        (<HTMLImageElement>document.getElementById(id)).src = '../assets/noImage.jpg';
    }

    standBy(classes) {
        const images = document.getElementsByClassName(classes);
        for (const e of <any>images) {
            (<HTMLImageElement>e).src = '../assets/noImage.jpg';
        }
    }

    setActiveContact(contact: Contact) {
        contact.ad.formattedTitle = this.formatAdTitle(contact.ad.title);
        this.activeContact = contact;
        this.readMessages();
        setTimeout(this.scrollDown, 5);
    }

    sendMessage() {
        const text = (<HTMLInputElement>document.getElementById('message-input')).value;
        if (text === '' || text === null || text === undefined || text === ' ') {
            return;
        }
        (<HTMLInputElement>document.getElementById('message-input')).value = '';
        const message = new Message();
        message.senderId = this.user.id;
        message.receiverId = this.activeContact.user.id;
        message.text = text;
        message.adId = this.activeContact.ad.id;
        message.adTitle = this.activeContact.ad.title;
        message.applicationId = this.activeContact.application.id;
        this.messageService.createMessage(message).subscribe(newMessage => {
            this.activeContact.messages.push(newMessage);
            this.activeContact.lastMessage = newMessage;
            setTimeout(this.scrollDown, 50);
        }, error => {
            this.handleError(error);
        });

    }

    scrollDown() {
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.scrollTop = messageContainer.scrollHeight + 300;
    }


    searchActiveContacts() {
        const text = (<HTMLInputElement>document.getElementById('search-input')).value;
        if (text === '' || text === null) {
            this.activeContacts = this.contacts;
        } else {
            const array = [];
            for (const e of <any>this.contacts) {
                if ((<Contact>e).user.userName.search(text) !== -1) {
                    array.push(e);
                }
            }
            this.activeContacts = array;
        }
    }


    toProfile(userId) {
        this.userService.getUserById(userId).subscribe(user => {
            this.gem.updateProfile(user);
            this.router.navigate(['profile']);
        }, error => {
            this.handleError(error);
        });
    }

    toAd(adId: number) {
        this.adService.getAdById(adId).subscribe(ad => {
            if (ad) {
                this.gem.updateSingleAd(ad);
                this.router.navigate(['ad']);
            }
        }, error => {
            this.handleError(error);
        });
    }

    onCompleteClicked() {
        this.applicationService.completeApplication(this.activeContact.application.id).subscribe(application => {
            this.gem.updateApplication(this.activeContact.application);
            sessionStorage.setItem('application', JSON.stringify(this.activeContact.application));
            this.router.navigate(['rate']);
        }, error => {
            this.handleError(error);
        });
    }

    onFailClicked() {
        this.applicationService.failedApplication(this.activeContact.application.id).subscribe(application => {
            this.gem.updateApplication(this.activeContact.application);
            sessionStorage.setItem('application', JSON.stringify(this.activeContact.application));
            this.router.navigate(['rate']);
        }, error => {
            this.handleError(error);
        });
    }


    handleError(error) {
        if (error.status === 401) {
            sessionStorage.clear();
            this.gem.updateUser(null);
            this.router.navigate(['login']);
        } else {
            if (error.error !== null) {
                this.error = error.error.message;
            } else {
                this.error = error.message;
            }
        }
        setTimeout(this.clearAlert, 3000);
    }

    clearAlert() {
        this.error = '';
        document.getElementById('error-div').innerText = '';
    }

    ngOnDestroy(): void {
        this.user = null;
    }

}
