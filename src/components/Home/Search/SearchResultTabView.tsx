import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  memo,
} from "react";
import { View, useWindowDimensions } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchResult from "./SearchResult";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { useFocusEffect } from "@react-navigation/native";

interface SearchResultTabViewProps {
  // search: string;
  data: any[];
  count: any;
  onRefresh: any;
  refreshing: boolean;
}

function SearchResultTabView({
  data,
  // search,
  count,
  onRefresh,
  refreshing,
}: SearchResultTabViewProps) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: "Curation", title: "큐레이션" },
    { key: "Story", title: "스토리" },
    { key: "Forest", title: "포레스트" },
  ]);

  // useEffect(focus, []);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        return (
          <SearchResult
            type={route.key}
            count={count[route.key]}
            data={data.filter((item) => item.model === route.key)}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        );
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      keyboardDismissMode="none"
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorContainerStyle={{
            borderBottomColor: "#848484",
            borderBottomWidth: 0.25,
          }}
          indicatorStyle={{
            backgroundColor: "#67D393",
          }}
          style={{
            marginTop: 10,
            backgroundColor: "white",
            shadowOffset: { height: 0, width: 0 },
            shadowColor: "transparent",
          }}
          renderLabel={({ route, focused, color }) => {
            return (
              <View>
                <Text
                  style={{
                    color: focused ? "#202020" : "#848484",
                    fontWeight: focused ? 600 : 400,
                    fontSize: 14,
                    letterSpacing: -0.6,
                  }}
                >
                  {route.title}
                </Text>
              </View>
            );
          }}
          pressColor={"transparent"}
        />
      )}
    />
  );
}

export default memo(SearchResultTabView);
