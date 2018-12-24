export class Range{
    start: number;
    end: number;

    constructor(start, end){
        this.start = start;
        this.end = end;
    }

    isInRange(num:number){
        return num >= this.start && num <= this.end; 
    }
}