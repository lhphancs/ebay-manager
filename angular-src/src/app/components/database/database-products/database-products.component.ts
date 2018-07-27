import { EntryASIN } from './../../../classesAndInterfaces/entryASIN';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from './../../../classesAndInterfaces/product';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DatabaseService } from '../../../services/database.service';
import { openSnackbar } from '../../snackbar';

let listOfCheckedIndexes:number[] = [];

@Component({
  selector: 'database-products',
  templateUrl: './database-products.component.html',
  styleUrls: ['./database-products.component.css']
})
export class DatabaseProductsComponent implements OnInit {
  products: Product[];
  displayedColumns: string[] = ['select', 'brand', 'name', 'stockNo', 'costPerBox', 'quantityPerBox', 'UPC', 'purchasedLocation'];
  dataSource;
  selection = new SelectionModel<EntryASIN>(true, []);

  constructor(private databaseService: DatabaseService
    , public snackBar: MatSnackBar) {
  }

  @ViewChild(MatSort) sort: MatSort;
  

  ngOnInit() {
    this.databaseService.getProducts().subscribe( (data) => {
      if(data['success']){
        this.products = data['products'];
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.sort = this.sort;
      }
      else
        openSnackbar(this.snackBar, data['msg']);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    listOfCheckedIndexes = [];
    if(this.isAllSelected())
      this.selection.clear();

    else{
      this.dataSource.data.forEach(row => this.selection.select(row));
      listOfCheckedIndexes = new Array(this.products.length);
      for(let i=0; i<this.products.length; ++i)
        listOfCheckedIndexes[i] = i;
    }
  }

  updateCheckedList(index, isChecked): void{
    if(isChecked)
      listOfCheckedIndexes.push(index);
    else
      listOfCheckedIndexes.splice(index, 1);
  }

  deleteProducts(amtToDelete:number): void{
    listOfCheckedIndexes.sort();
    for(let i=amtToDelete-1; i>=0; --i)
      this.products.splice(listOfCheckedIndexes[i], 1);
  }

  resetCheckedSelection(){
    listOfCheckedIndexes = [];
    this.selection.clear();
  }

  getUPCsOfSelected(amtToDelete){
    let UPCsToDelete = new Array(amtToDelete);
    for(let i=0; i<amtToDelete; ++i){
      let productIndex = listOfCheckedIndexes[i];
      UPCsToDelete[i] = this.products[productIndex].UPC;
    }
    return UPCsToDelete;
  }

  deleteCheckedProducts(): void{
    let amtToDelete:number = listOfCheckedIndexes.length;
    let UPCsToDelete = this.getUPCsOfSelected(amtToDelete);

    //Delete in database
    this.databaseService.deleteProducts(UPCsToDelete).subscribe( (data) =>{
      if(data['success']){
        //Update view
        this.deleteProducts(amtToDelete);
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.resetCheckedSelection();
      }
      openSnackbar(this.snackBar, data['msg']);
    });

    
  }
}
