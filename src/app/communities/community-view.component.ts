import { Component } from '@angular/core';
import { Community } from '../shared/models';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../shared/firebase.service';
import { FireJoinPipe } from '../shared/fire-join.pipe';


/**
 * Render a view of a community here
 */
@Component({
    moduleId: module.id,
    selector: 'community-view',
    template: `
    <div *ngIf="community">
        <h2>{{community.name }}</h2>
        <p>{{community.description}}</p>
        <p><strong>Location:</strong> {{community.location}}</p>
        <p><strong>Organizer:</strong> {{ (community.organizer | fireJoin:'/users/' | async)?.name}}</p>
        <p><a [href]="community.url">{{community.url}}</a></p>
    </div>
    <div *ngIf="!community">
        <p>Community not found.</p>
    </div>
    `,
    providers: [],
    pipes: [FireJoinPipe],
    directives: [],

})
export class CommunityViewComponent {
    community: Community;

    constructor(private route: ActivatedRoute, private communityService: FirebaseService<Community>) {
        communityService.setup('/communities/');

        // This calls .subscribe so we don't rely on the template for unrolling 
        // the observable (which requires 2 components)
        route.params.subscribe(params =>
            communityService.get(params['id']).subscribe((community) => {
                this.community = community;
            })
        );
    }
}