import { KeyboardTypeOptions } from "react-native";
import { TextInput } from "@react-native-material/core";
import { Dispatch, SetStateAction } from "react";
import { constants } from "../constants";

export function StyledTextInput(props: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  keyboardType: KeyboardTypeOptions;
  label: string;
  maxLength: number
}) {
  return (
    <TextInput
      variant="outlined"
      color={constants.colors.mainOrange}
      style={{ width: "90%", marginBottom: 10 }}
      secureTextEntry={props.label.toLowerCase().indexOf("senha") !== -1}
      label={props.label}
      keyboardType={props.keyboardType}
      maxLength={props.maxLength}
      value={props.value}
      onChangeText={props.setValue}
    />
  );
}
