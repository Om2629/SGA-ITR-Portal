import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalClients: any;
  completedFiles: any;
  newFiles: any;
  constructor(private dashboradService: DashboardService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.dashboradService.getData().subscribe(
      data => {
        this.totalClients = data.totalClients;
        this.completedFiles = data.completeFileCount;
        this.newFiles = data.newFileCount;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
