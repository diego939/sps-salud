// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { browser } from "$app/environment";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCOVOzzo6ZKD-O5Al7-ID07noRjNE6sHIs",
	authDomain: "sps-salud.firebaseapp.com",
	projectId: "sps-salud",
	storageBucket: "sps-salud.firebasestorage.app",
	messagingSenderId: "396651357076",
	appId: "1:396651357076:web:3a768d69d2fb3593e46581",
	measurementId: "G-G8MHNNTNRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in the browser
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (browser) {
	isSupported().then((supported) => {
		if (supported) {
			analytics = getAnalytics(app);
		}
	});
}

export { app, analytics };

