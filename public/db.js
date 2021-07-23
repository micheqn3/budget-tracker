/* IndexedDB script handles saving transactions when fetch request fails or device is offline */

// Opens database with version 1
let db;
const request = indexedDB.open('BudgetDB', 1);

// create object store called "BudgetStore" and set autoIncrement to true
request.onupgradeneeded = () => {
  db = request.result;
  const objectStore = db.createObjectStore('BudgetStore', {autoIncrement: true});
};

// Checks the db once the app is online
request.onsuccess = () => {
  db = request.result;

  if (navigator.onLine) {
    checkDB();
  }
};

// If there was an error opening the db
request.onerror = () => {
  console.log(event);
};

// Saves the transaction to the indexedDB
const saveRecord = (record) => {
  // Creates a transaction on the pending db with readwrite access
  // Creates an object store on the transaction
  // Add record to the store
  const tx = db.transaction('BudgetStore', 'readwrite');
  const objectStore = tx.objectStore('BudgetStore');
  let addRequest = objectStore.add(record);

  addRequest.onsuccess = () => {
    console.log('Record added successfully');
  }

  addRequest.onerror = () => {
    console.log("Failed to add record");
  }
}

// Access the store, retrieves all data
const checkDB = () => {
  const tx = db.transaction('BudgetStore', 'readonly');
  const objectStore = tx.objectStore('BudgetStore'); 
  let getAll = objectStore.getAll();

  getAll.onerror = () => {
    console.log('There was an error with getting all records.');
  }

// If there are records in the db, post it to the server
  getAll.onsuccess = () => {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // Clear all items in the store after successful post
          const tx = db.transaction('BudgetStore', 'readwrite');
          const objectStore = tx.objectStore('BudgetStore');
          let clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            console.log("IndexedDB cleared!");
          }

          clearRequest.onerror = () => {
            console.log("There was an error in clearing the db!");
          }
        });
    }
  };
}

// Checks the db for data when the device goes online
window.addEventListener('online', checkDB);
