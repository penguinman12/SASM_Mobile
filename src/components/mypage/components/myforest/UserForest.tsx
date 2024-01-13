import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Request } from '../../../../common/requests';
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../common/RequiredLogin';
import { TextPretendard as Text } from '../../../../common/CustomText';
import MyForestItemCard, { MyForestItemCardProps } from './MyForestItemCard';
import { FlatList } from 'react-native-gesture-handler';
import { SearchNCategory } from '../common/SearchNCategory';
import NothingIcon from "../../../../assets/img/nothing.svg";
import { OtherUserInfo } from '../../UserPageTabView';

export default function UserForest({email}: OtherUserInfo) {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [forestList, setForestList] = useState<MyForestItemCardProps[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [writtenPage, setWrittenPage] = useState<number>(1);
  const [max, setMax] = useState<number>(0);
  const [writtenMax, setWrittenMax] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [written, setWritten] = useState<MyForestItemCardProps[]>([]);
  const request = new Request();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isUser, setIsUser] = useState<boolean>(false);

  const rerender = () => {
    setRefresh(true);
    setPage(1)
    setRefresh(false);
  }

  const getForest = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList) {
      params.append('category_filter', category);
    }
    const response = await request.get(`/mypage/mypick_forest/?${params.toString()}`, { page: page, search: search });
    setMax(Math.ceil(response.data.data.count / 4))
    if (page == 1) setForestList(response.data.data.results);
    else setForestList([...forestList, ...response.data.data.results]);
  }
  
  const getWrittenForest = async () => {

    let params = new URLSearchParams();
    for (const category of checkedList) {
      params.append('category_filter', category);
    }
    const response = await request.get(`/mypage/user/other_forest/?${params.toString()}`, { page: writtenPage, search: search, email: email});
    setWrittenMax(Math.ceil(response.data.data.count / 4))
    if (writtenPage == 1) setWritten(response.data.data.results);
    else setForestList([...written, ...response.data.data.results]);
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) {
      getWrittenForest();
    }
  }, [isLogin, page, writtenPage, type, search, refresh, checkedList]))


  return (
    <View style={{ flex: 1 }}>
      <SearchNCategory
        checkedList={checkedList}
        setCheckedList={setCheckedList}
        edit={edit}
        setEdit={setEdit}
        setSearch={setSearch}
        search={search}
        setType={setType}
        type={type}
        setPage={type ? setPage : setWrittenPage}
        label='내 포레스트'
        forest
        isUser={isUser}
      />
      {
        isLogin ?
          (type ? forestList : written).length == 0 ?
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <NothingIcon />
              <Text style={{ marginTop: 20 }}>작성한 포레스트가 없습니다</Text>
            </View>
            :
            <>
              <FlatList
                data={type ? forestList : written}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }: { item: MyForestItemCardProps }) => (
                  <MyForestItemCard props={item} edit={edit} rerender={rerender} />
                )}
                onEndReached={() => {
                  if (type) {
                    if (page < max) {
                      setPage(page + 1);
                    }
                  } else {
                    if (writtenPage < writtenMax) {
                      setWrittenPage(writtenPage + 1);
                    }
                  }
                }}
                onEndReachedThreshold={0.3}
                style={{ alignContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
              />

            </>
          :
          <RequireLogin index={3} />
      }
    </View>
  )
}
