import { useState, useEffect, useCallback, useContext } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import NothingIcon from "../../../../assets/img/nothing.svg";
import { Request } from "../../../../common/requests";
import { useFocusEffect } from "@react-navigation/native";
import { LoginContext } from "../../../../common/Context";
import RequireLogin from "../common/RequiredLogin";
import { SearchNCategory } from "../common/SearchNCategory";
import MyPlaceItemCard, { MyPlaceItemCardProps } from "./MyPlaceItemCard";

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Title: {
    height: 50,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  Place: {
    alignItems: 'center',
    flex: 1
  },
});

const MyPlace = () => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [placeList, setPlaceList] = useState<MyPlaceItemCardProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [max, setMax] = useState<number>(1);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const request = new Request();
  const [type, setType] = useState<boolean>(true);
  const [written, setWritten] = useState<MyPlaceItemCardProps[]>([]);
  const [isUser, setIsUser] = useState<boolean>(true);

  const rerender = () => {
    setRefresh(true);
    setRefresh(false);
  }

  const getPlaces = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('filter', category);
    }
    const response = await request.get(`/mypage/myplace_search/?${params.toString()}`, {
      search: search,
      page: page
    })
    setMax(Math.ceil(response.data.data.count / 6));
    if (page == 1) setPlaceList(response.data.data.results);
    else setPlaceList([...placeList, ...response.data.data.results]);
  };

  const getWrittenReview = async () => {
    const response = await request.get('/mypage/my_reviewed_place/');
    setMax(Math.ceil(response.data.data.count / 6));
    setWritten(response.data.data.results);
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) {
      if (type) getPlaces();
      else getWrittenReview();
    }
  }, [isLogin, page, search, checkedList, type, refresh]))

  return (
    <View style={styles.Container}>
      {
        isLogin ?
          <>
            <SearchNCategory
              setPage={setPage}
              type={type} setType={setType}
              search={search} setSearch={setSearch}
              checkedList={checkedList} setCheckedList={setCheckedList}
              setEdit={setEdit} edit={edit}
              label="내 리뷰"
              isUser={isUser}
            />
            <View style={styles.Place}>
              {(type ? placeList : written).length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20, alignSelf: 'center' }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>해당하는 장소가 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={type ? placeList : written}
                  renderItem={({ item }: { item: MyPlaceItemCardProps }) => (
                    <MyPlaceItemCard
                      data={item}
                      edit={edit}
                      rerender={rerender}
                    />
                  )}
                  onEndReached={() => {
                    if (page < max) {
                      setPage(page + 1);
                    }
                  }}
                  onEndReachedThreshold={0.3}
                  numColumns={3}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </>
          :
          <RequireLogin index={0} />
      }
    </View>
  );
};

export default MyPlace;
