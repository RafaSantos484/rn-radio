import { View, StyleSheet, Image, Alert, Dimensions } from "react-native";
import { TextInput, Text, Button } from "@react-native-material/core";
import { useEffect, useState } from "react";

import { constants } from "../../constants";
import Background from "../../../assets/background.svg";

const window = Dimensions.get("window");
//const screen = Dimensions.get("screen");

export function Login(): JSX.Element {
  const [dimensions, setDimensions] = useState(window);
  const vw = dimensions.width;
  const vh = dimensions.height;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  });

  return (
    <View style={styles.container}>
      <Background
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      />
      <View style={{ ...styles.texts, marginVertical: 0.01 * vh }}>
        <Text variant="h5" color="wheat">
          MILHARES DE RÁDIOS AO ALCANCE DE UM TOQUE
        </Text>
        <Text
          variant="subtitle1"
          color="wheat"
          style={{ marginTop: 0.03 * vh }}
        >
          Faça login ou crie sua conta agora
        </Text>
      </View>

      <View style={styles.form}>
        <Image
          source={require("../../../assets/logo.png")}
          style={{
            resizeMode: "contain",
            height: 0.15 * vh,
            marginBottom: 0.03 * vh,
          }}
        />

        <TextInput
          variant="outlined"
          label="Email"
          color={constants.colors.mainOrange}
          style={styles.textInput}
        />
        <TextInput
          variant="outlined"
          label="Senha"
          style={{ ...styles.textInput, marginTop: 0.03 * vh }}
        />

        <View style={{ marginVertical: 0.03 * vh, alignItems: "center" }}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
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
    margin: 15,
  },
  textInput: { width: "80%" },
});
