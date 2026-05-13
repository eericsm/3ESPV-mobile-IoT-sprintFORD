import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Parse .env
const envFile = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [key, ...rest] = line.split('=');
      return [key.trim(), rest.join('=').trim().replace(/['"]/g, '')];
    })
);

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const vehicles = JSON.parse(fs.readFileSync('./data/vehicles.json', 'utf8'));

async function migrate() {
  console.log('Iniciando migração para o Firestore...');
  const vehiclesCol = collection(db, 'vehicles');
  
  for (const vehicle of vehicles) {
    try {
      const docRef = await addDoc(vehiclesCol, vehicle);
      console.log(`Sucesso: ${vehicle.brand} ${vehicle.model} adicionado com ID ${docRef.id}`);
    } catch (e) {
      console.error(`Erro ao adicionar ${vehicle.brand} ${vehicle.model}:`, e.message);
    }
  }
  console.log('Migração concluída!');
  process.exit(0);
}

migrate();
