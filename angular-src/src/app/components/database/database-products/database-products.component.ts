import { Product } from './../../../classesAndInterfaces/product';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DatabaseService } from '../../../services/database.service';
import { openSnackbar } from '../../snackbar';

@Component({
  selector: 'database-products',
  templateUrl: './database-products.component.html',
  styleUrls: ['./database-products.component.css']
})
export class DatabaseProductsComponent implements OnInit {
  products: Product[];
  displayedColumns: string[] = ['brand', 'name', 'stockNo', 'costPerBox', 'quantityPerBox', 'UPC', 'purchasedLocation'];
  dataSource;
  constructor(private databaseService: DatabaseService
    , public snackBar: MatSnackBar) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.databaseService.getProducts().subscribe( (data) => {
      if(data['success']){
        this.products = data['products'];
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });

  }
}
