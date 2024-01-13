import React, { useEffect, useRef, useState } from "react";
import { View, SafeAreaView } from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import SearchList from "./SearchList";
import DropDown from "../../../common/DropDown";
import NothingIcon from "../../../assets/img/nothing.svg";

interface SearchResultProps {
  type: string;
  search?: string;
  count: number;
  data: any[];
  onRefresh: any;
  refreshing: boolean;
}

function SearchResult({
  type,
  search,
  count,
  data,
  onRefresh,
  refreshing,
}: SearchResultProps) {
  const toggleItems = [
    { label: "최신 순", value: 0, order: "latest" },
    { label: "오래된 순", value: 1, order: "oldest" },
  ];
  // const [item, setItem] = useState(data);
  const [orderList, setOrderList] = useState(0);
  const isMounted = useRef(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
      <>
        <View
          style={{
            flexDirection: "row",
            zIndex: 1,
            alignItems: "center",
            padding: 15,
            backgroundColor: "#F1FCF5",
          }}
        >
          <Text
            style={{
              color: "#666666",
              fontSize: 14,
              fontWeight: "400",
              flex: 1,
            }}
          >
            전체 검색결과 {data.length}개
          </Text>
          <View style={{ width: 100, zIndex: 2000 }}>
            <DropDown
              value={orderList}
              setValue={setOrderList}
              isBorder={false}
              items={toggleItems}
            />
          </View>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center", flex: 1 }}>
          {data.length === 0 ? (
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <NothingIcon />
              <Text style={{ marginTop: 20 }}>
                해당하는 검색 결과가 없습니다.
              </Text>
            </View>
          ) : (
            <SearchList
              info={orderList === 0 ? data : data.slice().reverse()}
              onRefresh={onRefresh}
              refreshing={refreshing}
              type={type}
            />
          )}
        </View>
      </>
    </SafeAreaView>
  );
}
export default React.memo(SearchResult);
