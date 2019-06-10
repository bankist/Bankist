import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nomovs',
  templateUrl: './nomovs.component.html',
  styleUrls: ['./nomovs.component.scss']
})
export class NomovsComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  tutorial() {
    this.router.navigateByUrl('/tutorial');
  }
}
