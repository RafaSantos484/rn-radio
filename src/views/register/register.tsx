import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
} from "react-native";
import { Button, IconButton } from "@react-native-material/core";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackPropsList } from "../../../App";

import { constants } from "../../constants";
import Background from "../../../assets/background.svg";
import { StyledTextInput } from "../../components/styled-text-input";
import { Alert } from "react-native";
import { connect } from "react-redux";
import AlertComponent, {
  alertComponentViewStyle,
} from "../../components/alert-component";
import { resetAlertInfo, setAlertInfo } from "../../redux/actions";
import { createUser } from "../../api/firebase";

//let window = Dimensions.get("window");
//const screen = Dimensions.get("screen");

type RegisterViewNavigationProp = NativeStackNavigationProp<
  RootStackPropsList,
  "Register"
>;
type RegisterProps = {
  navigation: RegisterViewNavigationProp;
  message: string;
  severity: string;
  dispatch: Function;
};

function Register(props: RegisterProps): JSX.Element {
  const { navigation } = props;

  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const vw = dimensions.width;
  const vh = dimensions.height;
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function createAlert(message: string) {
    Alert.alert("Conta criada", message, [
      { text: "Ok", onPress: () => navigation.goBack() },
    ]);
  }

  function handlePress() {
    const inputs = [email, name, password, confirmPassword];
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
    if (password !== confirmPassword) {
      return props.dispatch(
        setAlertInfo({ message: "As senhas não coincidem", severity: "error" })
      );
    }

    setIsAwatingAsyncEvent(true);
    props.dispatch(
      setAlertInfo({
        message: "Criando conta",
        severity: "info",
      })
    );

    createUser(email, password, name)
      .then(() => {
        props.dispatch(resetAlertInfo());
        createAlert(
          "Conta criada. Um email de verificação foi enviado. Verifique seu email, realize o login e começe a ouvir!"
        );
      })
      .catch((err) => {
        if (err.message.startsWith("Conta criada")) {
          props.dispatch(resetAlertInfo());
          return createAlert(err.message);
        }

        props.dispatch(
          setAlertInfo({
            severity: "error",
            message: err.message,
          })
        );
      })
      .finally(() => setIsAwatingAsyncEvent(false));
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  });

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
          <View style={styles.form}>
            <View style={{ ...styles.nav, marginBottom: 0.05 * vh }}>
              <IconButton
                icon={() => (
                  <AntDesign
                    name="leftcircle"
                    color={
                      isAwatingAsyncEvent ? "gray" : constants.colors.mainOrange
                    }
                    size={0.1 * vw}
                  />
                )}
                disabled={isAwatingAsyncEvent}
                onPress={() => navigation.goBack()}
              />
              <Image
                source={require("../../../assets/logo.png")}
                style={{
                  resizeMode: "contain",
                  height: 0.15 * vh,
                  width: 0.55 * vw,
                }}
              />
            </View>

            <StyledTextInput
              label="Email"
              keyboardType="email-address"
              maxLength={50}
              value={email}
              setValue={(value) => setEmail(value.toString().trim())}
            />
            <StyledTextInput
              label="Nome"
              keyboardType="ascii-capable"
              maxLength={15}
              value={name}
              setValue={(value) => setName(value.toString().trimStart())}
            />
            <StyledTextInput
              label="Senha"
              keyboardType="ascii-capable"
              maxLength={15}
              value={password}
              setValue={(value) => setPassword(value.toString().trim())}
            />
            <StyledTextInput
              label="confirmar senha"
              keyboardType="ascii-capable"
              maxLength={15}
              value={confirmPassword}
              setValue={(value) => setConfirmPassword(value.toString().trim())}
            />

            <Button
              title="Cadastrar"
              color={constants.colors.mainOrange}
              titleStyle={{ color: "white" }}
              style={{ marginTop: 0.03 * vh }}
              disabled={isAwatingAsyncEvent}
              onPress={handlePress}
            />
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
  form: {
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "white",
    paddingVertical: 15,
  },
  nav: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  textInput: { width: "80%" },
});

const mapStateToProps = (state) => state.alertComponentReducer;

export default connect(mapStateToProps)(Register);
