import { View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { useRef } from "react";
import { TextPretendard as Text } from "../../../common/CustomText";
import Arrow from "../../../assets/img/common/Arrow.svg";
import CurationCard from "./SearchCurationCard";
import StoryCard from "./SearchStoryCard";
import ForestCard from "./SearchForestCard";

interface SearchListProps {
  info: any;
  onEndReached?: any;
  onRefresh?: any;
  refreshing?: boolean;
  type: string;
}

export default function SearchList({
  info,
  onEndReached,
  onRefresh,
  refreshing,
  type,
}: SearchListProps) {
  const { width } = Dimensions.get("screen");
  const scrollRef = useRef<FlatList>(null);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  return (
    <FlatList
      ref={scrollRef}
      data={info}
      numColumns={type === "Curation" ? 3 : 1}
      renderItem={({ item }) => {
        switch (type) {
          case "Curation":
            return <CurationCard data={item} />;
          case "Story":
            return <StoryCard data={item} />;
          case "Forest":
            return <ForestCard data={item} />;
          default:
            return <></>;
        }
      }}
      keyExtractor={(item, index) => String(index)}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onEndReached}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        width: width,
        flexGrow: 1,
        alignItems: "flex-start",
        paddingHorizontal: 5,
      }}
      ListFooterComponent={
        <View
          style={{
            width: width,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <TouchableOpacity
            onPress={scrollToTop}
            style={{ flexDirection: "row" }}
          >
            <Arrow
              width={18}
              height={18}
              transform={[{ rotate: "270deg" }]}
              color={"#666666"}
            />
            <Text
              style={{
                color: "#666666",
                fontWeight: "600",
                marginTop: 4,
                marginLeft: 10,
              }}
            >
              맨 위로 이동
            </Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}
