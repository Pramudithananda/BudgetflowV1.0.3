import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "budgetflow-demo.firebaseapp.com",
  projectId: "budgetflow-demo",
  storageBucket: "budgetflow-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };