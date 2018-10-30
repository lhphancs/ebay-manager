import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'navtabs',
  templateUrl: './navtabs.component.html',
  styleUrls: ['./navtabs.component.css']
})
export class NavtabsComponent implements OnInit {
  @Input('leftSublinks') leftSublinks: Object[];
  @Input('rightSublinks') rightSublinks: Object[];
  
  constructor() { }

  ngOnInit() {
  }

}
