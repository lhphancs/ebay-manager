import { MatTableDataSource } from '@angular/material';
/** Whether the number of selected elements matches the total number of rows. */
function isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
function masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
}

function isFilledLastEntry(): boolean{
    let data = this.dataSource.data;

    let lastEntryIndex = data.length-1;
    let isLastASINFilled = !(data[lastEntryIndex].ASIN == null);
    let isLastPackAmtFilled = !(data[lastEntryIndex].packAmt == null);
    let isLastPreparationFilled = !(data[lastEntryIndex].preparation == null);
    return isLastASINFilled || isLastPackAmtFilled || isLastPreparationFilled;
}


function isEmptyStringField(value){
if(value == null) return true;
    return value.trim() == "";
}

function isEmptyEntry(entry){
return this.isEmptyStringField(entry.ASIN)
    && entry.packAmt == null && this.isEmptyStringField(entry.preparation);
}

function isCompleteEntry(entry){
return !this.isEmptyStringField(entry.ASIN)
    && entry.packAmt != null && !this.isEmptyStringField(entry.preparation);
}

module.exports = {
    

}