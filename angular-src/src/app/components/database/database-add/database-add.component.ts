import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

interface EntryASIN {
  ASIN: string;
  packAmt: number;
}

let entriesASIN: EntryASIN[] = [
  {ASIN: null, packAmt: null}
];

let listOfCheckedIndexes:number[] = [];

@Component({
  selector: 'app-database-add',
  templateUrl: './database-add.component.html',
  styleUrls: ['./database-add.component.css']
})
export class DatabaseAddComponent implements OnInit {
  displayedColumns: string[] = ['select', 'ASIN', 'packAmt'];
  dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
  selection = new SelectionModel<EntryASIN>(true, []);

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
      listOfCheckedIndexes = new Array(entriesASIN.length);
      for(let i=0; i<entriesASIN.length; ++i)
        listOfCheckedIndexes[i] = i;
    }
  }

  constructor() { }

  ngOnInit() {
  }

  addBlankEntry(): void{
    entriesASIN.push( {ASIN:null, packAmt:null} as EntryASIN );
    this.dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
  }

  addBlankEntryIfDeleteAll(): void{
    if(entriesASIN.length < 0 ){
      this.addBlankEntry();
    }
  }

  isFilledLastEntry(): boolean{
    let lastEntryIndex = entriesASIN.length-1;
    let lastASIN:string = entriesASIN[lastEntryIndex].ASIN;
    let lastPackAmt:number = entriesASIN[lastEntryIndex].packAmt;
    let isLastASINFilled:boolean = !(lastASIN == null);
    let isLastPackAmtFilled:boolean = !(lastPackAmt == null);
    return isLastASINFilled || isLastPackAmtFilled;
  }

  addBlankEntryIfNeeded(): void{
    if(entriesASIN.length == 0 || this.isFilledLastEntry())
      this.addBlankEntry();
  }

  deleteEntries(amtToDelete:number): void{
    listOfCheckedIndexes.sort();
    for(let i=amtToDelete-1; i>=0; --i)
    entriesASIN.splice(listOfCheckedIndexes[i], 1);
  }

  deleteCheckedEntries(): void{
    let amtToDelete:number = listOfCheckedIndexes.length;
    if(amtToDelete >= entriesASIN.length)
    entriesASIN = [];
      
    else{
      this.deleteEntries(amtToDelete);
      this.addBlankEntryIfNeeded();
    }
    this.addBlankEntryIfNeeded();
    listOfCheckedIndexes = [];
    this.dataSource = new MatTableDataSource<EntryASIN>(entriesASIN);
    this.selection = new SelectionModel<EntryASIN>(true, []);
  }

  updateCheckedList(index, isChecked): void{
    if(isChecked)
      listOfCheckedIndexes.push(index);
    else
    entriesASIN.splice(listOfCheckedIndexes[index], 1);
  }

  onSubmit(){
    console.log("MEOW");
  }
}
