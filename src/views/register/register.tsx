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
import { TextInput, Button, IconButton } from "@react-native-material/core";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackPropsList } from "../../../App";

import { constants } from "../../constants";
import Background from "../../../assets/background.svg";
import { StyledTextInput } from "../../components/styled-text-input";

type LoginViewNavigationProp = NativeStackNavigationProp<
  RootStackPropsList,
  "Register"
>;
type props = {
  navigation: LoginViewNavigationProp;
};

//let window = Dimensions.get("window");
//const screen = Dimensions.get("screen");

export function Register({ navigation }: props): JSX.Element {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const vw = dimensions.width;
  const vh = dimensions.height;
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleClick() {
    const inputs = [email, name, password, confirmPassword];
    if (inputs.findIndex((input) => input === "") !== -1) {
      return console.log("Preencha todos os campos");
    }

    setIsAwatingAsyncEvent(true);
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              value={email}
              setValue={(value) => setEmail(value.toString().trim())}
            />
            <StyledTextInput
              label="Nome"
              keyboardType="ascii-capable"
              value={name}
              setValue={(value) => setName(value.toString().trimStart())}
            />
            <StyledTextInput
              label="Senha"
              keyboardType="ascii-capable"
              value={password}
              setValue={(value) => setPassword(value.toString().trim())}
            />
            <StyledTextInput
              label="confirmar senha"
              keyboardType="ascii-capable"
              value={confirmPassword}
              setValue={(value) => setConfirmPassword(value.toString().trim())}
            />

            <Button
              title="Cadastrar"
              color={constants.colors.mainOrange}
              titleStyle={{ color: "white" }}
              style={{ marginTop: 0.03 * vh }}
              disabled={isAwatingAsyncEvent}
              onPress={handleClick}
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
