import { TouchableOpacity, View, Dimensions, Platform } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import Arrow from "../../../assets/img/common/Arrow.svg";
import Close from "../../../assets/img/common/Close.svg";

interface FormHeaderProps {
  onLeft: any;
  onRight: any;
  begin?: boolean;
  end?: boolean;
}

const PlaceFormHeader = ({ onLeft, onRight, begin, end }: FormHeaderProps) => {
  const { height } = Dimensions.get("window");
  return (
    <View
      style={{
        height: Platform.OS === "ios" ? height * 0.11 : height * 0.08,
        backgroundColor: "#67D393",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <TouchableOpacity
        style={{
          height: "100%",
          paddingBottom: 18,
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
        onPress={onLeft}
      >
        {onLeft != null &&
          (begin ? (
            <Close
              width={18}
              height={18}
              color={"white"}
              strokeWidth={3}
              style={{ marginLeft: 5 }}
            />
          ) : (
            <Arrow
              width={20}
              height={20}
              transform={[{ rotate: "180deg" }]}
              color="white"
            />
          ))}
      </TouchableOpacity>
      <Text
        style={{
          flex: 4,
          fontWeight: "700",
          color: "white",
          fontSize: 20,
          textAlign: "center",
          paddingBottom: 15,
          paddingHorizontal: 15,
        }}
      >
        장소 제보하기
      </Text>
      <TouchableOpacity
        style={{
          height: "100%",
          paddingBottom: 18,
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingRight: 10,
        }}
        onPress={onRight}
      >
        <Close
          width={18}
          height={18}
          color={"white"}
          strokeWidth={3}
          style={{ marginRight: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlaceFormHeader;
