import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type User = FirebaseAuthTypes.User;

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
*/

export function onRetrieveLoggedUser(
  callback: (user: User | null) => void
): void {
  auth().onAuthStateChanged(callback);
}

export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await user.sendEmailVerification();
  } catch {
    throw new Error("ERRO: Falha ao enviar email");
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<void> {
  try {
    //const auth = getAuth(firebaseApp);

    const user = (await auth().createUserWithEmailAndPassword(email, password))
      .user;

    await user.updateProfile({ displayName: name });
    await sendVerificationEmail(user);
  } catch (err: any) {
    let message;

    if (err.message === "ERRO: Falha ao enviar email") {
      message =
        "ERRO: Conta criada mas houve uma falha para enviar o email de verificação. Tente fazer login para tentarmos enviar o email novamente";
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

export async function login(email: string, password: string): Promise<User> {
  try {
    return (await auth().signInWithEmailAndPassword(email, password)).user;
  } catch (err: any) {
    console.log(err.code);

    let message;
    switch (err.code) {
      case "auth/too-many-requests":
        message =
          "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
        break;
      case "auth/invalid-email":
        message = "ERRO: Email inválido";
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "ERRO: Usuário não encontrado";
        break;
      default:
        message = "ERRO: Falha ao realizar login. Tente novamente mais tarde";
    }

    throw new Error(message);
  }
}

export async function logout(): Promise<void> {
  try {
    await auth().signOut();
  } catch (err: any) {
    console.log(err.code);
    let message;

    switch (err.code) {
      case "auth/too-many-requests":
        message =
          "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
        break;
      default:
        message = "ERRO: Falha ao sair";
    }

    throw new Error(message);
  }
}
