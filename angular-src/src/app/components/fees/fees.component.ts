import { DatabaseUsersService } from './../../services/database-users.service';
import { DatabaseFeesService } from './../../services/database-fees.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fees',
  templateUrl: './fees.component.html',
  styleUrls: ['../products/products-add-or-update/products-add-or-update.component.css']
})
export class FeesComponent implements OnInit {
  userId;

  ebayPercentageFromSaleFee:number;
  paypalPercentageFromSaleFee:number;
  paypalFlatFee:number;
  constructor(private databaseUsersService: DatabaseUsersService
    , private databaseFeesService:DatabaseFeesService) { }

  ngOnInit() {
    this.databaseUsersService.getProfile().subscribe( (data) =>{
      if(data['_id']){
        this.userId=data['_id'];
        this.databaseFeesService.getFees(this.userId).subscribe( (data) =>{
          if(data['success']){
            let fees = data['fees'];
            this.ebayPercentageFromSaleFee = fees['ebayPercentageFromSaleFee'];
            this.paypalPercentageFromSaleFee = fees['paypalPercentageFromSaleFee'];
            this.paypalFlatFee = fees['paypalFlatFee'];
          }
        });
      }
    });
  }

}
