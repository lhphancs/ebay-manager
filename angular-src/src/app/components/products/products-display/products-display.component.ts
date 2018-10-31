import { ProductsComponent } from '../products.component';
import { Stack } from '../../../classesAndInterfaces/Stack';
import { SelectionModel } from '@angular/cdk/collections';
import { Product } from '../../../classesAndInterfaces/Product';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';

import { openSnackbar } from '../../snackbar';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { DatabaseProductsService } from '../../../services/database-products.service';
import { DatabaseShippingsService } from '../../../services/database-shippings.service';
import { addAsinsToProducts } from '../../modifyProducts';

@Component({
  selector: 'products-display',
  templateUrl: './products-display.component.html',
  styleUrls: ['./products-display.component.css']
})

export class ProductsDisplayComponent implements OnInit {
  loadingMsg = "Loading products..."

  userId;
  dictShipIdToName = {};
  filterValue: string;
  products: Product[];
  displayedColumns: string[] = ['select', 'name', 'stockNo', 'costPerBox', 'quantityPerBox', 'costPerSingle', 'ASINS', 'UPC', 'wholesaleComp', 'packsInfo'];
  dataSource: MatTableDataSource<Product>;
  selection = new SelectionModel<Product>(true, []);
  deletedGroupsStack: Stack; // Used to undo delete

  constructor(private productsComponent:ProductsComponent,
    private databaseProductsService: DatabaseProductsService
    , private databaseShippingsService: DatabaseShippingsService
    , public snackBar: MatSnackBar, private dialog: MatDialog){
      this.deletedGroupsStack = new Stack();
  }
  sort;

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
       this.dataSource.sort = this.sort;
  
    }
  }
  
  ngOnInit() {
    this.userId = this.productsComponent.userId;
    this.databaseShippingsService.getShipMethods(this.userId).subscribe((data)=>{
      this.initializeShippingMethods(data['shipMethods']);
      this.databaseProductsService.getProducts(this.userId).subscribe( (data) => {
        if(data['success']){
          this.products = data['products'];
          addAsinsToProducts(this.products);
          this.dataSource = new MatTableDataSource<Product>(this.products);
          this.dataSource.sort = this.sort;
        }
        else
          openSnackbar(this.snackBar, data['msg']);
      });
    });
  }

  initializeShippingMethods(methods){
    for(let method of methods)
      this.dictShipIdToName[method._id]= method.shipCompanyName + " - " + method.shipMethodName;
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
      this.dataSource.filter = this.filterValue;
    });
    this.selection = new SelectionModel<Product>(true, []);
  }

  getUPCsFromProducts(produts){
    let UPCs = [];
    produts.forEach(item => {
      UPCs.push(item.UPC);
    });
    return UPCs;
  }

  removeSelectedRows() {
    let productsToDelete = [];
    this.selection.selected.forEach(item => {
      productsToDelete.push(item);
    });

    let UPCsToDelete = this.getUPCsFromProducts(productsToDelete);
    this.databaseProductsService.deleteProducts(this.userId, UPCsToDelete).subscribe( (data) =>{
      if(data['success']){
        this.deleteFromView();
        this.deletedGroupsStack.push(productsToDelete);
      }
      openSnackbar(this.snackBar, data['msg']);
    });
  }

  addToView(productsToAdd){
    productsToAdd.forEach(item => {
      this.dataSource.data.push(item);
    });
    this.dataSource.filter = this.filterValue;
  }

  undoDelete(){
    let productsToAddBack = this.deletedGroupsStack.peek();
    this.databaseProductsService.addManyProducts(this.userId
      , productsToAddBack).subscribe( (data) =>{
      if(data['success']){
        this.addToView(productsToAddBack);
        this.deletedGroupsStack.pop();
      }
      openSnackbar(this.snackBar, data['msg']);
    });
  }

  openDeleteConfirmDialog(){
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data:{title: "Confirmation", msg: "Are you sure you want to delete?"}
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if(result)
        this.removeSelectedRows();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}