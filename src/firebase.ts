import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Booking, CustomerProfile, AdminNotification } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as required by skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection confirmed.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
    } else {
      console.log('Firebase initialized (test doc ping checked).');
    }
    return false;
  }
}

// Auth helpers
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-in error:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Firestore operations with handleFirestoreError
export async function createBookingDoc(booking: Omit<Booking, 'id'>): Promise<string> {
  const path = 'bookings';
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, booking);

    // Also trigger admin notification in Firestore
    try {
      await addDoc(collection(db, 'adminNotifications'), {
        bookingId: docRef.id,
        title: `신규 예약 접수 [${booking.serviceCategory}]`,
        message: `${booking.companyName || booking.userName}님께서 ${booking.date} (${booking.timeSlot}) 현장 기술지원을 예약하셨습니다.`,
        type: booking.urgency === 'emergency_2hr' ? 'urgent_request' : 'new_booking',
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // notification logging is non-blocking
    }

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBookingStatusDoc(
  bookingId: string, 
  status: Booking['status'],
  assignedEngineer?: string,
  resolutionNotes?: string
): Promise<void> {
  const path = `bookings/${bookingId}`;
  try {
    const docRef = doc(db, 'bookings', bookingId);
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (assignedEngineer !== undefined) updateData.assignedEngineer = assignedEngineer;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveCustomerProfileDoc(
  customerId: string, 
  profile: Partial<CustomerProfile>
): Promise<void> {
  const path = `customers/${customerId}`;
  try {
    const docRef = doc(db, 'customers', customerId);
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
