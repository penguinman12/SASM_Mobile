import { Dimensions, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import { TabProps } from "../../../../App";
import { TextPretendard as Text } from "../../../common/CustomText";

export default function SearchStoryCard({ data }: any) {
  const { width } = Dimensions.get("screen");
  const navigation = useNavigation<StackNavigationProp<TabProps>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("스토리", { id: data.id })}
    >
      <View
        style={{
          flexDirection: "row",
          width: width - 30,
          marginHorizontal: 10,
          height: 130,
          justifyContent: "space-between",
          borderBottomColor: "rgba(203, 203, 203, 1)",
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height: 130,
            width: width - 150,
            justifyContent: "center",
          }}
        >
          <Text style={[textStyles.writer, { color: "#67D393" }]}>
            {data.nickname}
          </Text>
          <Text numberOfLines={2} style={textStyles.title}>
            {data.content}
          </Text>
          <Text style={textStyles.placename} numberOfLines={1}>
            {data.title}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={textStyles.date}>
            {data.created.slice(0, 10).replace(/-/gi, ".")} 작성
          </Text>
          <FastImage
            source={{ uri: data.rep_pic, priority: FastImage.priority.normal }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
              marginRight: 8,
              marginLeft: 20,
              marginTop: 5,
              backgroundColor: "grey",
            }}
          />
        </View>
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
  },
  placename: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.6,
    flex: 1,
    marginVertical: 6,
  },
  preview: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.6,
  },
  writer: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 8,
  },
  date: {
    fontSize: 12,
    fontWeight: "400",
    color: "#676767",
    textAlign: "right",
    margin: 10,
  },
});
