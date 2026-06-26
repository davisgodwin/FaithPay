import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Dashboard from './pages/Dashboard'; 
import AddDonation from './pages/AddDonation'; 
import Receipt from './pages/Receipt';
import SplashScreen from './components/SplashScreen'; // Imported our custom premium loading screen

// 1. Import our Firestore db instance and cloud SDK methods
import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

function App() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Stream real-time contribution ledger updates straight from Firestore
  useEffect(() => {
    // We order records by timestamp so newest contributions sit safely at the top
    const donationsQuery = query(collection(db, "donations"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(donationsQuery, (snapshot) => {
      const liveRecords = snapshot.docs.map(docSnap => ({
        id: docSnap.id, // Using Firestore's unique auto-generated document hash ID
        ...docSnap.data()
      }));
      setDonations(liveRecords);
      setLoading(false);
    }, (error) => {
      console.error("Firestore listening error: ", error);
      setLoading(false);
    });

    // Clean up snapshot subscription listener when component unmounts
    return () => unsubscribe();
  }, []);

  // 3. Upload new Paystack payment records straight to the cloud collection
  const addDonation = async (newRecord) => {
    try {
      await addDoc(collection(db, "donations"), {
        name: newRecord.name,
        type: newRecord.type,
        amount: newRecord.amount,
        currency: newRecord.currency || 'NGN', // Save ISO identifier
        currencySymbol: newRecord.currencySymbol || '₦', // Save display currency design asset
        date: newRecord.date,
        reference: newRecord.reference || 'Manual',
        createdAt: new Date() 
      });
    } catch (error) {
      console.error("Error committing record to cloud: ", error);
      alert("Failed to sync record to cloud database.");
    }
  };

  // 4. Drop an entry cleanly from Firestore using its document reference ID
  const deleteDonation = async (id) => {
    try {
      const docRef = doc(db, "donations", id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error removing cloud asset records: ", error);
      alert("Failed to remove record from database.");
    }
  };

  // Intercept layout rendering with the clinical splash transition while data loads
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<AddDonation onAdd={addDonation} />} />
        <Route path="/admin" element={<Dashboard donations={donations} onDelete={deleteDonation} />} />
        <Route path="/receipt" element={<Receipt />} />
      </Routes>
    </Router>
  );
}

export default App;