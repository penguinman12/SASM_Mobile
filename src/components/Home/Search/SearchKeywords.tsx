import { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
} from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import Close from "../../../assets/img/common/Close.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchKeywordsProps {
  search: String;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchKeywords({
  search,
  setSearch,
}: SearchKeywordsProps) {
  const { width } = Dimensions.get("screen");
  const recommendData = [
    "비건",
    "제로웨이스트",
    "카페",
    "식당",
    "서울",
    "한강",
    "자연",
  ];

  const [recentSearches, setRecentSearches] = useState([] as any);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("recentSearches_home");
      if (searches) {
        const searchesArray = JSON.parse(searches);
        setRecentSearches(searchesArray);
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearches = async (search: any) => {
    try {
      await AsyncStorage.setItem("recentSearches_home", JSON.stringify(search));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim() === "") return;
    const updatedSearches = [search, ...recentSearches];
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleDeleteSearch = (search: string) => {
    const updatedSearches = recentSearches.filter(
      (item: any) => item !== search
    );
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.removeItem("recentSearches_home");
    } catch (e) {
      console.error(e);
    }
    setRecentSearches([]);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          borderColor: "#E3E3E3",
          borderTopWidth: 1,
          marginTop: 10,
          paddingHorizontal: 15,
          paddingTop: 15,
        }}
      >
        <Text
          style={{
            color: "#3C3C3C",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 15,
          }}
        >
          추천 검색어
        </Text>
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          {recommendData.map((item) => (
            <TouchableOpacity
              onPress={() => {
                setSearch(item);
                handleSearchSubmit();
              }}
              style={{
                height: 30,
                borderRadius: 16,
                borderColor: "#67D393",
                borderWidth: 1,
                paddingVertical: 4,
                paddingHorizontal: 16,
                marginRight: 8,
                marginBottom: 8,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#202020", fontSize: 14 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flex: 4, paddingHorizontal: 20, marginTop: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              color: "#3C3C3C",
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 15,
              lineHeight: 20,
            }}
          >
            최근 검색어
          </Text>
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text
              style={{
                color: "#848484",
                fontSize: 14,
                fontWeight: "500",
                lineHeight: 20,
              }}
            >
              전체삭제
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentSearches}
          renderItem={({ item }: any) => (
            <View
              style={{
                flexDirection: "row",
                borderBottomColor: "#A8A8A8",
                borderBottomWidth: 1,
                width: width - 40,
                height: 35,
                paddingVertical: 5,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => setSearch(item)}
              >
                <Text style={{ color: "#373737" }}>{item}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSearch(item)}>
                <Close
                  width={10}
                  height={10}
                  color={"#A8A8A8"}
                  strokeWidth={3}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
}
