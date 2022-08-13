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
import { Text, Button } from "@react-native-material/core";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackPropsList } from "../../../App";

import { constants } from "../../constants";
import Background from "../../../assets/background.svg";
import { StyledTextInput } from "../../components/styled-text-input";

type LoginViewNavigationProp = NativeStackNavigationProp<
  RootStackPropsList,
  "Login"
>;
type props = {
  navigation: LoginViewNavigationProp;
};

//let window = Dimensions.get("window");
//const screen = Dimensions.get("screen");

export function Login({ navigation }: props): JSX.Element {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const vw = dimensions.width;
  const vh = dimensions.height;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*function resetFields() {
    setEmail("");
    setPassword("");
  }*/

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
                  //resetFields();
                  navigation.navigate("Register");
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
              value={email}
              setValue={setEmail}
            />
            <StyledTextInput
              label="Senha"
              keyboardType="ascii-capable"
              value={password}
              setValue={setPassword}
            />

            <View style={{ marginTop: 0.04 * vh, alignItems: "center" }}>
              <Button
                title="Login"
                color={constants.colors.mainOrange}
                titleStyle={{ color: "white" }}
              />
              <Button
                title="Esqueci a senha"
                variant="text"
                color={constants.colors.mainRed}
                style={{ marginTop: 0.02 * vh }}
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
