export class ShipMethod{
  name:string;
  description:string;
  ozPrice:object[];

  constructor(name, description, ozPrice){
    this.name = name;
    this.description = description;
    this.ozPrice = ozPrice;
  }
}