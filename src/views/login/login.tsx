import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Button, ActivityIndicator } from "@react-native-material/core";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
//import app from "@react-native-firebase/app";
import { RootStackPropsList } from "../../../App";

import { constants } from "../../constants";
import Background from "../../../assets/background.svg";
import { StyledTextInput } from "../../components/styled-text-input";
import AlertComponent, {
  alertComponentViewStyle,
} from "../../components/alert-component";
import { connect } from "react-redux";
import { AlertInfo, setAlertInfo, setUser, User } from "../../redux/actions";
import {
  login,
  onRetrieveLoggedUser,
  sendVerificationEmail,
} from "../../api/firebase";

type LoginViewNavigationProp = NativeStackNavigationProp<
  RootStackPropsList,
  "Login"
>;
type LoginProps = {
  navigation: LoginViewNavigationProp;
  userReducer: User;
  dispatch: Function;
};

function Login(props: LoginProps): JSX.Element {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);
  const [isRetrievingUser, setIsRetrievingUser] = useState(true);
  const { navigation } = props;
  const vw = dimensions.width;
  const vh = dimensions.height;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function resetFields(): void {
    setEmail("");
    setPassword("");
  }

  async function handleLogin(): Promise<void> {
    Keyboard.dismiss();

    const inputs = [email, password];
    if (inputs.findIndex((input) => input === "") !== -1) {
      return props.dispatch(
        setAlertInfo({ message: "Preencha todos os campos", severity: "error" })
      );
    }
    if (password.length < 8) {
      return props.dispatch(
        setAlertInfo({
          message: "A senha deve ter, no mínimo, 8 caracteres",
          severity: "error",
        })
      );
    }

    setIsAwatingAsyncEvent(true);
    login(email, password)
      .then(async (user) => {
        if (email !== "generico@email.com" && !user.emailVerified) {
          await sendVerificationEmail(user);
          props.dispatch(
            setAlertInfo({
              severity: "warning",
              message:
                "Email não verificado. um novo email de verificação foi enviado",
            })
          );
        }
      })
      .catch((err) =>
        props.dispatch(
          setAlertInfo({
            severity: "error",
            message: err.message,
          })
        )
      )
      .finally(() => setIsAwatingAsyncEvent(false));
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    if (isRetrievingUser) {
      onRetrieveLoggedUser((user) => {
        setIsRetrievingUser(false);

        if (props.userReducer?.isAnonymous) return;

        let newUser = null;
        if (user && user.emailVerified) {
          newUser = {
            favorites: [],
            history: [],
            id: user.uid,
            name: user.displayName ? user.displayName : "",
            isAnonymous: false,
          };
        }
        props.dispatch(setUser(newUser));
      });
    }

    navigation.addListener("blur", () => resetFields());

    if (props.userReducer) {
      navigation.navigate("Dashboard");
    }

    return () => subscription?.remove();
  });

  if (isRetrievingUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={constants.colors.mainOrange} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "orange" }}
    >
      <Background
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <View style={alertComponentViewStyle}>
        <AlertComponent />
      </View>

      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ position: "absolute", zIndex: 2 }}
      >
        <View style={styles.container}>
          <View style={styles.texts}>
            <Text variant="h5" color="wheat">
              MILHARES DE RÁDIOS AO ALCANCE DE UM TOQUE
            </Text>
            <Text
              variant="subtitle1"
              color="wheat"
              style={{ marginTop: 0.03 * vh, fontSize: 18 }}
            >
              Faça login ou{" "}
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  textDecorationLine: "underline",
                }}
                onPress={() => {
                  if (!isAwatingAsyncEvent) {
                    resetFields();
                    navigation.navigate("Register");
                  }
                }}
              >
                crie sua conta agora!
              </Text>
            </Text>
          </View>

          <View style={{ ...styles.form }}>
            <Image
              source={require("../../../assets/logo.png")}
              style={{
                resizeMode: "contain",
                height: 0.15 * vh,
                width: 0.55 * vw,
                marginBottom: 0.06 * vh,
              }}
            />

            <StyledTextInput
              label="Email"
              keyboardType="email-address"
              maxLength={50}
              value={email}
              setValue={(value) => setEmail(value.toString().trim())}
            />
            <StyledTextInput
              label="Senha"
              keyboardType="ascii-capable"
              maxLength={15}
              value={password}
              setValue={(value) => setPassword(value.toString().trim())}
            />

            <View style={{ marginTop: 0.04 * vh, alignItems: "center" }}>
              <Button
                title="Login"
                color={constants.colors.mainOrange}
                titleStyle={{ color: "white" }}
                onPress={handleLogin}
                disabled={isAwatingAsyncEvent}
              />
              <Button
                title="Esqueci a senha"
                variant="text"
                color={constants.colors.mainRed}
                style={{ marginTop: 0.02 * vh }}
                disabled={isAwatingAsyncEvent}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  texts: {
    width: "90%",
    alignItems: "center",
  },
  form: {
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 10,
  },
});

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(Login);
