import { useState, useEffect, useCallback, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, Pressable } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import MyCurationItemCard, { MyCurationItemCardProps } from "./MyCurationItemCard";
import NothingIcon from "../../../../assets/img/nothing.svg";
import Search from "../../../../assets/img/common/Search.svg";
import { Request } from "../../../../common/requests";
import SearchBar from '../../../../common/SearchBar';
import { useFocusEffect } from '@react-navigation/native';
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../common/RequiredLogin';
import { SearchNoCategory } from '../common/SearchNCategory';
import { OtherUserInfo } from '../../UserPageTabView';

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  Title: {
    height: 50,
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    flexDirection: 'row'
  },
  Searchbox: {
    height: 50,
    justifyContent: "flex-end",
    paddingRight: 15,
    alignItems: "center",
    flexDirection: 'row',
    zIndex: 1
  },
  Curation: {
    alignItems: 'flex-start',
    flex: 1
  },
});

const UserCuration = ({email}: OtherUserInfo) => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [curationList, setCurationList] = useState<MyCurationItemCardProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const request = new Request();
  const [written, setWritten] = useState<MyCurationItemCardProps[]>([]);
  const [writtenPage, setWrittenPage] = useState<number>(1);
  //true일 경우, 좋아요한 큐레이션 false일 경우, 작성한 큐레이션
  const [type, setType] = useState<boolean>(false);
  // SearchNCategory 로 넘겨줘서 내 글 보기 버튼 유무
  const [isUser, setIsUser] = useState<boolean>(false);

  const rerender = () => {
    setRefresh(true);
    setRefresh(false);
  }

  const getCuration = async () => {
    const response = await request.get("/mypage/my_liked_curation/", {
      search: search,
    });
    setCurationList(response.data.data);
  };

  const getWrittenCuration = async () => {
    let params = new URLSearchParams();
    const response = await request.get(`/mypage/user/other_curation/?${params.toString()}`, { page: writtenPage, search: search, email: email});
    setWritten(response.data.data);  
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) {
      getWrittenCuration();
    }
  }, [isLogin, type, search, refresh]))

  return (
    <View style={styles.Container}>
      {
        isLogin ?
          <>
            <SearchNoCategory setEdit={setEdit} edit={edit} setSearch={setSearch} search={search} setType={setType} type={type} label='내 큐레이션' isUser={isUser} />
            <View style={styles.Curation}>
              {(type ? curationList : written).length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20, alignSelf: 'center' }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>작성한 큐레이션이 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={type ? curationList : written}
                  renderItem={({ item }: { item: MyCurationItemCardProps }) => (
                    <MyCurationItemCard
                      rerender={rerender}
                      edit={edit}
                      props={item}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                  numColumns={2}
                />
              )}
            </View>
          </>
          :
          <RequireLogin index={2} />
      }
    </View>
  );
};

export default UserCuration;
