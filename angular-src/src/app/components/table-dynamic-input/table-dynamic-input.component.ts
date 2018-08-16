import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'table-dynamic-input',
  templateUrl: './table-dynamic-input.component.html',
  styleUrls: ['./table-dynamic-input.component.css']
})
export class TableDynamicInputComponent implements OnInit {
  @Input('normalHeaders') normalHeaders: string[];
  @Input('nonTableHeaders') nonTableHeaders: string[];
  @Input('entries') entries: Object[];

  dataSource = new MatTableDataSource<Object>();
  selection = new SelectionModel<Object>(true, []);

  getNullValuesObj(){
      let nullValueObj = {};
      for(let key of this.normalHeaders){
        nullValueObj[key] = null;
      }
      return nullValueObj;
  }

  constructor() {}

  ngOnInit() {
    this.dataSource.data = this.entries;
    this.dataSource.data.push({ASIN:null, packAmt:null, preparation: null});
    this.dataSource = new MatTableDataSource<Object>(this.dataSource.data);
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

  addBlankEntryIfNeeded(): void{
    if(this.dataSource.data.length <= 0 || this.isFilledLastEntry()){
      this.dataSource.data.push(this.getNullValuesObj());
      this.dataSource = new MatTableDataSource<Object>(this.dataSource.data);
    }  
  }

  removeSelectedRows(){
    this.selection.selected.forEach(item => {
      let index: number = this.dataSource.data.findIndex(d => d === item);
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource<Object>(this.dataSource.data);
    });
    this.addBlankEntryIfNeeded();
    this.selection = new SelectionModel<Object>(true, []);
  }

  isFilledLastEntry(): boolean{
    let data = this.dataSource.data;

    let lastEntryIndex = data.length-1;
    let lastObj = data[lastEntryIndex];
    for(let key in lastObj){
      if( lastObj[key] != null) return true;
    }
    return false;
  }
}
