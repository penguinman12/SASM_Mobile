import { useState, useEffect, useCallback, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, Pressable } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import MyStoryItemCard, { MyStroyItemCardProps } from "./MyStoryItemCard";
import NothingIcon from "../../../../assets/img/nothing.svg";
import Search from "../../../../assets/img/common/Search.svg";
import { Request } from "../../../../common/requests";
import Category from '../../../../common/Category';
import SearchBar from '../../../../common/SearchBar';
import { useFocusEffect } from '@react-navigation/native';
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../common/RequiredLogin';
import { SearchNCategory } from '../common/SearchNCategory';
import { OtherUserInfo } from '../../UserPageTabView';

const styles = (isCategory?: boolean) => StyleSheet.create({
  Container: {
    flex: 1
  },
  Title: {
    height: 50,
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    flexDirection: 'row'
  },
  Story: {
    alignItems: 'center',
    flex: 1
  },
});

const UserStory = ({email}: OtherUserInfo) => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [edit, setEdit] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [storyList, setStoryList] = useState<MyStroyItemCardProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [writtenPage, setWrittenPage] = useState<number>(1);
  const [max, setMax] = useState<number>(1);
  const [writtenMax, setWrittenMax] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [nextPage, setNextPage] = useState<any>(null);
  const [checkedList, setCheckedList] = useState([] as any);
  const request = new Request();
  const [type, setType] = useState<boolean>(false);
  const [written, setWritten] = useState<MyStroyItemCardProps[]>([]);
  const [isUser, setIsUser] = useState<boolean>(false);

  const rerender = () => {
    setRefresh(true);
    setPage(1);
    setRefresh(false);
  }

  const getWrittenStory = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('filter', category);
    }
    const response = await request.get(`/mypage/user/other_story/?${params.toString()}`, {
      search: search,
      page: writtenPage,
      email : email
    });
    console.log('story', response.data)
    setWrittenMax(Math.ceil(response.data.count / 6));
    if(writtenPage == 1) setWritten(response.data);
    else setWritten([...written, ...response.data])
  }
  
  useFocusEffect(useCallback(() => {
    if (isLogin) {
      getWrittenStory();
    }
  }, [isLogin, page, writtenPage, type, search, checkedList, refresh]));


  return (
    <View style={styles().Container}>
      {
        isLogin ?
          <>
            <SearchNCategory
              edit={edit}
              setEdit={setEdit}
              setType={setType}
              type={type}
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              label='내 스토리'
              isUser={isUser}
            />
            <View style={styles().Story}>
              {written.length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20, alignSelf: 'center' }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>작성한 스토리가 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={written}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }: any) =>
                    <MyStoryItemCard
                    edit={edit}
                    rerender={rerender}
                      data={item}
                    />
                  }
                  onEndReached={() => {
                    if(type){
                      if (page < max) setPage(page + 1);
                    } else {
                      if (writtenPage < writtenMax) setWrittenPage(writtenPage + 1);
                    }
                  }}
                  onEndReachedThreshold={0.3}
                  numColumns={2}
                  style={{ alignContent: 'space-between' }}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </>
          :
          <RequireLogin index={1} />
      }
    </View>
  );
};

export default UserStory;
