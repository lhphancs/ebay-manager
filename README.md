# inventory-manager
## Purpose: Inventory manager to store details of products and calculate profits from eBay and amazon

IMPORTANT: At the moment, project should only be used locally due to security reasons.

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

ex) 
Attempt | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 | #11
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
Seconds | 301 | 283 | 290 | 286 | 289 | 285 | 287 | 287 | 272 | 276 | 269

This means that a maximum of 5 "aProd2" can fit into "USPS - Flat rate envelope". The oz is not required because it is "Flat rate".
