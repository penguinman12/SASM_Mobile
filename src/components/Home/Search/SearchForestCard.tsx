import { View, Dimensions, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { TabProps } from "../../../../App";
import { TextPretendard as Text } from "../../../common/CustomText";

export default function SearchForestCard({ data }: any) {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation<StackNavigationProp<TabProps>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("포레스트", { id: data.id })}
    >
      <View
        style={{
          width: width - 30,
          marginHorizontal: 10,
          height: 90,
          justifyContent: "center",
          alignContent: "flex-start",
          borderBottomColor: "#00000066",
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={textStyles.title}>{data.title}</Text>
        <Text style={textStyles.writer}>{data.nickname}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.6,
    color: "#373737",
    width: "80%",
    marginVertical: 5,
  },
  writer: {
    fontSize: 12,
    fontWeight: "400",
    color: "#209DF5",
  },
});
