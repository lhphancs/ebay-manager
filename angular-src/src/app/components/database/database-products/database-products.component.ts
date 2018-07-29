import { EntryASIN } from '../../../classesAndInterfaces/entryASIN';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from '../../../classesAndInterfaces/product';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { DatabaseService } from '../../../services/database.service';
import { openSnackbar } from '../../snackbar';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'database-products',
  templateUrl: './database-products.component.html',
  styleUrls: ['./database-products.component.css']
})
export class DatabaseProductsComponent implements OnInit {
  products: Product[];
  displayedColumns: string[] = ['select', 'brand', 'name', 'stockNo', 'costPerBox', 'quantityPerBox', 'UPC', 'purchasedLocation', 'update'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);

  constructor(private databaseService: DatabaseService
    , public snackBar: MatSnackBar, private dialog: MatDialog) {
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
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  deleteFromView(){
    this.selection.selected.forEach(item => {
      let index: number = this.products.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource<Product>(this.dataSource.data);
    });
    this.selection = new SelectionModel<Product>(true, []);
  }

  removeSelectedRows() {
    let UPCsToDelete = [];
    this.selection.selected.forEach(item => {
      UPCsToDelete.push(item.UPC);
    });

    this.databaseService.deleteProducts(UPCsToDelete).subscribe( (data) =>{
      if(data['success']){
        this.deleteFromView();
      }
      openSnackbar(this.snackBar, data['msg']);
    });
  }

  openConfirmDialog(){
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{title: "Confirmation", msg: "Are you sure you want to delete?"}
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if(result)
        this.removeSelectedRows();
    });
  }
}