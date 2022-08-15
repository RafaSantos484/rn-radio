import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, onValue, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);

/*export async function getDoc(path, onValueCallback = null) {
  const dbRef = ref(getDatabase(firebaseApp), path);

  return onValueCallback
    ? onValue(dbRef, (snapshot) => onValueCallback(snapshot.val()))
    : (await get(dbRef)).val();
}

export async function setDoc(path, data) {
  const dbRef = ref(getDatabase(firebaseApp), path);

  return await set(dbRef, data);
}

export async function handleFavoriteClick(user, radio) {
  let actionMessage;
  let newFavorites;
  try {
    const dbRef = ref(getDatabase(firebaseApp), `users/${user.id}/favorites`);

    if (user.favorites.findIndex((f) => f.id === radio.id) !== -1) {
      newFavorites = user.favorites.filter((f) => f.id !== radio.id);
      actionMessage = "remover";
    } else {
      newFavorites = user.favorites;
      newFavorites.unshift(radio);
      actionMessage = "adicionar";
    }

    return await set(dbRef, newFavorites);
  } catch (err) {
    throw new Error(`ERRO: Falha ao ${actionMessage} favorito`);
  }
}

export function onRetrieveLoggedUser(callback) {
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, callback);
}
*/
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch {
    throw new Error(
      "Conta criada mas houve uma falha para enviar o email de verificação. Tente fazer login para tentarmos enviar o email novamente"
    );
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<void> {
  try {
    const auth = getAuth(firebaseApp);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    await sendVerificationEmail(res.user);
  } catch (err) {
    let message;

    if (err.message.startsWith("Conta criada")) {
      message = err.message;
    } else {
      switch (err.code) {
        case "auth/too-many-requests":
          message =
            "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
          break;
        case "auth/invalid-email":
          message = "ERRO: Email inválido";
          break;
        case "auth/email-already-in-use":
          message = "ERRO: Email já cadastrado";
          break;
        case "auth/invalid-password":
          message = "ERRO: Senha inválida";
          break;
        default:
          console.log(err.code);
          message = "ERRO: Falha ao criar usuário. Tente novamente mais tarde";
      }
    }

    throw new Error(message);
  }
}

/*export async function login(email, password) {
  try {
    const auth = getAuth(firebaseApp);

    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err.code);

    let message;
    if (err.code) {
      switch (err.code) {
        case "auth/too-many-requests":
          message =
            "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "ERRO: Usuário não encontrado";
          break;
        default:
          message = "ERRO: Falha ao realizar login. Tente novamente mais tarde";
      }
    } else {
      message = "ERRO: Falha ao realizar login. Tente novamente mais tarde";
    }

    throw new Error(message);
  }
}

export async function logout() {
  try {
    const auth = getAuth(firebaseApp);

    return await signOut(auth);
  } catch (err) {
    console.log(err.code);
    let message;

    if (err.code) {
      switch (err.code) {
        case "auth/too-many-requests":
          message =
            "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
          break;
        default:
          message = "ERRO: Falha ao sair";
      }
    } else {
      message = "ERRO: Falha ao sair";
    }

    throw new Error(message);
  }
}
*/
