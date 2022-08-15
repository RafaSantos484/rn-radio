import { AntDesign } from "@expo/vector-icons";
import { IconButton } from "@react-native-material/core";
import { Text, ViewStyle } from "react-native";
import { connect } from "react-redux";
import { resetAlertInfo } from "../redux/actions";
import Animated, { SlideInLeft } from "react-native-reanimated";

type Props = { dispatch: Function; message: string; severity: string };

function AlertComponent(props: Props): JSX.Element {
  if (props.message === "" || props.severity === "") return <></>;

  const viewColors = { error: "#eda9a8", info: "#8cd1f1" };
  const iconNames = { error: "exclamationcircle", info: "infocirlce" };
  const textColors = { error: "#c62828", info: "#01579b" };

  return (
    <Animated.View
      entering={SlideInLeft}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: viewColors[props.severity],
        padding: 15,
        borderRadius: 10,
        width: "80%",
        /*position: "absolute",
        top: 50,
        zIndex: 11,*/
      }}
    >
      <AntDesign
        name={iconNames[props.severity]}
        size={20}
        style={{ marginRight: 15 }}
        color={textColors[props.severity]}
      />
      <Text style={{ color: textColors[props.severity], maxWidth: "80%" }}>
        {props.message.replace("ERRO: ", "")}
      </Text>
      <IconButton
        icon={() => (
          <AntDesign
            name="close"
            size={20}
            color={textColors[props.severity]}
          />
        )}
        onPress={() => props.dispatch(resetAlertInfo())}
      />
    </Animated.View>
  );
}

const mapStateToProps = (state) => state.alertComponentReducer;

export const alertComponentViewStyle: ViewStyle = {
  position: "absolute",
  width: "100%",
  alignItems: "center",
  zIndex: 10,
  top: 50,
};

export default connect(mapStateToProps)(AlertComponent);
