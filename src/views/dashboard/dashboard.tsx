import { StyleSheet, Dimensions } from "react-native";
import { Button, Text } from "@react-native-material/core";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackPropsList } from "../../../App";

import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../../api/firebase";
import { User } from "../../redux/actions";

type LoginViewNavigationProp = NativeStackNavigationProp<
  RootStackPropsList,
  "Dashboard"
>;
type DashboardProps = {
  navigation: LoginViewNavigationProp;
  userReducer: User;
};

function Dashboard(props: DashboardProps): JSX.Element {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);
  const { navigation } = props;
  const vw = dimensions.width;
  const vh = dimensions.height;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    if (!props.userReducer) {
      navigation.goBack();
    }

    return () => subscription?.remove();
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text>dashboard...</Text>
      <Button title="Sair temp" onPress={() => logout()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state: any) => state;

export default connect(mapStateToProps)(Dashboard);
