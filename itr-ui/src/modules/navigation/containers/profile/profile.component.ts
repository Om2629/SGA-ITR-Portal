import { Component, OnInit } from '@angular/core';
import { TokenManagerService } from '@modules/app-common/services/TokenManagerService';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userName:any;
  userDetails: any;
  sessionAttributes = environment.SESSION_ATTRIBUTES;
  constructor(private tokenManagerService: TokenManagerService, private dashboradService: DashboardService) { }

  ngOnInit(): void {
    this.userName = this.tokenManagerService.getItemFromSessionStorage(this.sessionAttributes.USERNAME);
    this.getData()
  }

  getData() {
    this.dashboradService.getUsersData(this.userName).subscribe(
      data => {
        this.userDetails = data;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

}
