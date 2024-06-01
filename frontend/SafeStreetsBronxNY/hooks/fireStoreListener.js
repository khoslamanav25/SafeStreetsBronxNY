import { useEffect, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';

const useFirestoreListener = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            const q = query(
                collection(FIRESTORE_DB, "reports"),
                orderBy('time', 'desc'),
                limit(5)
            );

            onSnapshot(q, (querySnapshot) => {
                const now = new Date();
                const currentUnixSeconds = Math.floor(now.getTime() / 1000);
                let alert = false;
                const items = [];
                querySnapshot.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    items.push(item);
                    
                    if ((currentUnixSeconds - item.time.seconds) < 30 && FIREBASE_AUTH.currentUser.uid != item.user) {

                        alert = true;
                        console.log(item.time.seconds);
                    }
                });

                if (alert) {
                    ToastAndroid.showWithGravity("ALERT: CHECK MAPS FOR POTENTIAL INCIDENT NEARBY", ToastAndroid.LONG, ToastAndroid.TOP);
                }
                setData(items);
            }, (error) => {
                Alert.alert('Error', error.message);
            });
        };

        fetchData(); // Fetch data initially

        const interval = setInterval(() => {
            fetchData(); // Fetch data at regular intervals
        }, 10000); // Interval set to 30 seconds

        // Cleanup interval and snapshot listener on unmount
        return () => {
            clearInterval(interval);
        };

    }, []);

    return data;
};

export default useFirestoreListener;
