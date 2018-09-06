export class ShipMethod{
  _id:string;
  userId:string;
  shipCompanyName: string;
  shipMethodName: string;
  description:string;
  ozPrice:object[];

  constructor(_id, userId, shipCompanyName, shipMethodName, description, ozPrice){
    this._id = _id;
    this.userId = userId;
    this.shipCompanyName = shipCompanyName;
    this.shipMethodName = shipMethodName;
    this.description = description;
    this.ozPrice = ozPrice;
  }
}