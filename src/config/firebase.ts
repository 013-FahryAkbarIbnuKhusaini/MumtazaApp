import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  inMemoryPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAqSoVerN1qp9I4-5wg9JuRFZeZg-2-vUo",
  authDomain: "mumtazaapp.firebaseapp.com",
  projectId: "mumtazaapp",
  storageBucket: "mumtazaapp.firebasestorage.app",
  messagingSenderId: "912584848252",
  appId: "1:912584848252:web:f796cf29144ee6be452af9",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth =
  getApps().length === 1
    ? initializeAuth(app, {
        persistence: inMemoryPersistence,
      })
    : getAuth(app);

export { app, auth };

