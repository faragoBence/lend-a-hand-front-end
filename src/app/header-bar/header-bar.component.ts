import {Component, OnInit} from '@angular/core';
import {GlobalEventManagerService} from '../global-event-manager.service';
import {Router} from '@angular/router';
import {User} from '../user.model';
import {Filter} from '../filter.model';

@Component({
    selector: 'app-header-bar',
    templateUrl: './header-bar.component.html',
    styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {
    keyword: string;
    categories = ['All', 'Babysitting', 'IT', 'Garden', 'Learning', 'Building'];
    selectedCategory: string;
    user: User;

    constructor(private gem: GlobalEventManagerService, private router: Router) {
    }

    ngOnInit() {

        this.gem.userEmitter.subscribe(user => {
            this.user = user;
        });
    }

    filterByKeywordAndCategory() {
        this.gem.updateFilter(new Filter(this.keyword, this.selectedCategory));
    }

    search() {
        this.gem.updateKeywordFilter(this.keyword);
    }

    filterCategory() {
        this.gem.updateCategoryFilter(this.selectedCategory);
        document.getElementById('filters').classList.add('hidden');
    }

    login() {
        this.router.navigate(['login']);
    }

    backToMain() {
        this.gem.updateCategoryFilter('All');
        this.keyword = '';
    }

    showFilters() {
        if (document.getElementById('filters').classList.contains('hidden')) {
            document.getElementById('filters').classList.remove('hidden');
        } else {
            document.getElementById('filters').classList.add('hidden');
        }

    }

}