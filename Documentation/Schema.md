Users 
{
  "_id": "ObjectId",
  "firebaseUID": "string",        // from Firebase Auth
  "name": "string",
  "email": "string",
  "role": "string",               // buyer, seller, renter, admin
  "createdAt": "Date"
}



Properties
{
  "_id": "ObjectId",
  "ownerId": "ObjectId",           // reference to Users._id
  "type": "string",                // sale, rent
  "category": "string",            // rent, sale
  "title": "string",               // e.g., "2BHK Apartment in Delhi"
  "description": "string",
  "location": {
    "city": "string",
    "state": "string",
    "pincode": "string"
  },
  "price": "number",               // listed price
  "status": "string",              // available, booked, sold
  "createdAt": "Date"
}


PriceTransperancyReports
{
  "_id": "ObjectId",
  "propertyId": "ObjectId",         // reference to Properties._id
  "userId": "ObjectId",             // reference to Users._id
  "reportedPrice": "number",        // what user thinks is fair price
  "trustScore": "number",           // 1–5 scale on trustworthiness
  "feedback": "string",             // open text
  "createdAt": "Date"
}


Example
{
  "_id": "ObjectId",
  "propertyId": "ObjectId",
  "buyerId": "ObjectId",
  "sellerId": "ObjectId",
  "finalPrice": "number",
  "transactionDate": "Date"
}
