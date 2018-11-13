import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatSort } from '@angular/material';
import { Product } from 'src/app/classesAndInterfaces/Product';
import { SelectionModel } from '@angular/cdk/collections';
import { calculateDesiredSaleValue } from '../profitCalculations'

@Component({
  selector: 'calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.css']
})
export class CalculationsComponent implements OnInit {
  @Input('dataSource') dataSource;
  @Input('dictShipIdToName') dictShipIdToName: Object;
  @Input('dictShipIdAndOzToCost') dictShipIdAndOzToCost: Object;
  @Input('percentages') percentages: number[];
  @Input('flatFees') flatFees: number[];
  

  loadingMsg = "Loading products..."
  desiredProfitPerSingle = 1;
  
  displayedColumns: string[] = ['name', 'stockNo', 'stockLocation', 'costPerSingle'
    , 'ASINS', 'UPC', 'wholesaleComp', 'calculations'];
  selection = new SelectionModel<Product>(true, []);

  constructor(){
  }

  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
    }
  }
  
  ngOnInit() {
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculateDesiredPrice(packAmt, shipId, oz, costPerSingle){
    let roundedUpOz = oz ? Math.ceil(oz): "";
    let key = shipId in this.dictShipIdAndOzToCost ? shipId: shipId + roundedUpOz;
    let shipCost = this.dictShipIdAndOzToCost[key];
    
    return calculateDesiredSaleValue(this.desiredProfitPerSingle, packAmt, costPerSingle, shipCost
      , this.percentages, this.flatFees, 0, true);
  }
}
