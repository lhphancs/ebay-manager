# inventory-manager

## Purpose: MEAN application that serves as an inventory manager for eBay by providing a database for product information.
### IMPORTANT: At the moment, project should only be used locally due to security reasons.

### Features
- Database to store product details and shipping details
- eBay and Shopify desired price calculations for each product in the database
- eBay specific manual input calculator to determine profit amount or desired price
- Listing analysis by using eBay API. Can detect out of stock or undesirable prices


### Main running instructions
1. Open command prompt
2. cd into inventory-manager
3. Run the following commands:
```
npm install
node ./
```
4. cd into angular-src
5. Run the following command:
```
npm install
npm start
```

### (Optional) Running product insert script instructions
1. Open command prompt
2. cd into mongodbInsertScript
3. Run the following command:
```
py csvsInsertToMongodb.py
```

Notes: sample files have been provided inside the two directories:

1. placeShipMethodExcelFileHere
2. placeWholesaleExcelFileHere

These two excel files should be deleted and replaced. The program may not work correctly if two excel files are in a single directory.

The data in 'placeShipMethodExcelFileHere' is the maximum amount of a product that will fit into a ship method.

#### Example 

|  UPC |  Name  | Quant |         Ship type         | oz |
|:----:|:------:|:-----:|:-------------------------:|:--:|
| 0002 | aProd2 |   5   | USPS - Flat rate envelope |  - |

This means that a maximum of 5 "aProd2" can fit into "USPS - Flat rate envelope". The oz is not required because it is "Flat rate".
