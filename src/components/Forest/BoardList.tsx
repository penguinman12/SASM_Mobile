import React, { useState, useEffect, useCallback,useRef, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent
} from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CardView from "../../common/CardView";
import CustomHeader from "../../common/CustomHeader";
import PostItem, { HotPostItem } from "./components/PostItem";
import BoardItem from "./components/BoardItem";
import { LoginContext } from "../../common/Context";
import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import PlusButton from "../../common/PlusButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../App";
import Arrow from '../../assets/img/common/Arrow.svg';
import AddCategory from '../../assets/img/Forest/AddCategory.svg';
import UserCategories from "./components/UserCategories";
import { SelectedCategoryContext, SelectedCategoryProvider }from './SelectedCategoryContext';


const { width, height } = Dimensions.get("screen");

const BoardListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "BoardList">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [page, setPage] = useState(1);
  const [boardLists, setBoardLists] = useState([] as any);
  const [posts, setPosts] = useState([] as any);
  const [hotPosts, setHotPosts] = useState([] as any);
  const [newPosts, setNewPosts] = useState([] as any);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [userCategories, setUserCategories] = useState([] as any);
  const [topCategories, setTopCategories] = useState([] as any);
  const {isLogin, setLogin} = useContext(LoginContext);
  const{selectedCategories, setSelectedCategories, selectedIds, setSelectedIds}=useContext(SelectedCategoryContext);
  const [showbarCategory, setshowbarCategory] = useState(false);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const flatListRef=useRef(null);
  const [customHeight,setcustomHeight]=useState<number>(0);
  const [flatHeight,setflatHeight]=useState<number>(0);
  const request = new Request();

  const getUserInfo = async () =>
   {
    const response = await request.get('/mypage/me/', {}, {});
    setNickname(response.data.data.nickname);
  }

  const getBoardItems = async () => {
    const response = await request.get('/forest/categories/');
    setBoardLists(response.data.data.results);
  }

  const getUserCategories = async () => {
    const response = await request.get('/forest/user_categories/get/');
    setUserCategories([...response.data.data.results, {id: 0, name: '+'}]);
    setTopCategories([...response.data.data.results]);
  }

  const getPosts = async () => {
    let params = new URLSearchParams();
    for (const category of selectedCategories){
      params.append('semi_category_filters', String(category.id));
    }
    const response = await request.get(`/forest/?${params.toString()}`, {}, null);
    const response_hot = await request.get(`/forest/?${params.toString()}`, { order: 'hot' }, null);
    const response_new = await request.get(`/forest/?${params.toString()}`, { order: 'latest' }, null);
    setPosts(response.data.data.results);
    setHotPosts(response_hot.data.data.results);
    setNewPosts(response_new.data.data.results);
  };
  
  const chunkArray = (array: any, size: number) => {
    const chunkedArray = [];
    const length = array.length;
    let index = 0;
  
    while (index < length && chunkedArray.length < size) {
      const chunk = array.slice(index, index + size);
      chunkedArray.push(chunk);
      index += size;
    }
  
    return chunkedArray;
  };
  

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  }

  const handleCustomHeaderLayout = (event:LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    setcustomHeight(y+height);
  }

  const handleCardViewLayout=(event:LayoutChangeEvent)=>{
    const{y,height} = event.nativeEvent.layout;
    setflatHeight(customHeight+height+y);
  }

  const handleScroll=(event:NativeSyntheticEvent<NativeScrollEvent>)=>{
    if(flatListRef.current){
      const scrollPosition = event.nativeEvent.contentOffset.y;
        if(scrollPosition>flatHeight+5){
        setshowbarCategory(true);
        }
        else{
          setshowbarCategory(false);
        }
    }
  }

  useEffect(() => {
    getBoardItems();
  }, [refreshing]);

  useFocusEffect(useCallback(() => {
    if(isLogin) {
      getUserInfo();
      getUserCategories();
    }
  }, [isLogin, modalVisible]))

  useFocusEffect(useCallback(() => {
    getPosts();
  }, [refreshing, selectedCategories]))

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onSearch={() => {
          navigation.navigate("PostSearch");
        }}
      />
      <View onLayout={handleCustomHeaderLayout}>
      </View>
      {showbarCategory&&
                <View style={{padding: 15, backgroundColor: '#F1FCF5'}}>
                <CardView gap={0} offset={0} pageWidth={width} dot={false} data={topCategories} renderItem={({item}: any) => {
                  return (
                    <TouchableOpacity style={{borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, margin: 4, backgroundColor: selectedIds.includes(item.id) ? '#67D393' : 'white'}}
                    onPress={() => {
                      if (selectedIds.includes(item.id)) {
                        setSelectedIds(selectedIds.filter(id => id !== item.id));
                        setSelectedCategories(selectedCategories.filter((category: any) => category.id !== item.id));
                      } else {
                        setSelectedIds(selectedIds=>[...selectedIds, Number(item.id)]);
                        setSelectedCategories(selectedCategories=>[...selectedCategories, item]);
                      }
                    }}
                  >
                    <Text style={{color: selectedIds.includes(item.id) ? 'white' : '#202020', fontSize: 14, fontWeight: selectedIds.includes(item.id) ? '600' : '400'}}># {item.name}</Text>
                  </TouchableOpacity>
                  )
                }}
                />
                </View>
      }
      <ScrollView onScroll={handleScroll} scrollEventThrottle={25}>
          <View
            style={{ backgroundColor: "#C8F5D7", padding: 20, height: 100 }}
          >
            <Text style={{ color: '#3C3C3C', fontWeight: '700', fontSize: 16, lineHeight: 22, letterSpacing: -0.6 }}>{isLogin? (`${nickname}님 이 정보들은 어떠신가요?`):('로그인 후 추천 글을 받아보세요')}</Text>
            <TouchableOpacity style={{flexDirection: 'row', marginTop: 10}} onPress={() => navigation.navigate('PostDetail', {post_id: posts[0]?.id})}>
              <View style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 4, backgroundColor: 'white'}}>
                <Text style={{color: '#67D393', fontSize: 10, fontWeight: '600'}}>#{posts[0]?.semi_categories[0].name}</Text>
              </View>
              <Text style={{color: '#3C3C3C', fontSize: 12, lineHeight: 18, marginLeft: 5}} numberOfLines={1}>{posts[0]?.title}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#F1FCF5",
              alignItems: "center",
              minHeight: 240,
              justifyContent: "flex-end",
            }}
          >
            { isLogin &&
            <View onLayout={handleCardViewLayout}>
              <View 
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  width: 360, 
                  borderWidth: 1, 
                  borderColor: '#E3E3E3', 
                  borderRadius: 4, 
                  paddingVertical: 5, 
                  marginTop: 240,
                  marginBottom: 30,
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}
              >
                { userCategories.length > 0 ?
                  <>
                    <FlatList
                      ref={flatListRef}
                      data={userCategories}
                      renderItem={({ item }: any) => {
                        if(item.id === 0){
                          return (
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                              <AddCategory />
                            </TouchableOpacity>
                          )
                        } else {
                          return (
                            <TouchableOpacity style={{ borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, marginVertical: 4, backgroundColor: selectedIds.includes(item.id) ? '#67D393' : 'white' }}
                              onPress={() => {
                                if (selectedIds&&selectedIds.includes(item.id)) {
                                  setSelectedIds(selectedIds.filter(id => id !== item.id));
                                  setSelectedCategories(selectedCategories.filter((category: any) => category.id !== item.id));
                                } else {
                                  setSelectedIds(selectedIds => {
                                    const updatedIds = [... selectedIds, item.id];
                                    return updatedIds;
                                  });
                                  setSelectedCategories([...selectedCategories, item]);
                                }
                              }}
                            >
                              <Text style={{ color: selectedIds.includes(item.id) ? 'white' : '#67D393', fontSize: 14, fontWeight: '700' }}># {item.name}</Text>
                            </TouchableOpacity>
                          )
                        }}
                      }
                      contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10, alignItems: 'center' }}
                      keyExtractor={(item) => item.id.toString()}
                    />
                  </>
                  :
                  <>
                    <Text style={{color: '#848484', fontSize: 16, fontWeight: '700', marginRight: 10}}>
                      {nickname}님의 카테고리를 추가해보세요.
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <AddCategory />
                    </TouchableOpacity>
                  </>
                }
              </View>
              </View>
            }
          </View>
          <View
            style={{
              position: "absolute",
              top: 80,
              left: 15,
              width: width - 30,
              backgroundColor: "white",
              borderColor: "#E3E3E3",
              borderWidth: 1,
              alignItems: "center",
              borderRadius: 4,
            }}
          >
            <FlatList
              data={boardLists}
              renderItem={({ item }: any) => (
                <BoardItem
                  key={item.id}
                  data={item}
                  onPress={() => {
                    navigation.navigate("BoardDetail", { board_category: item , user_select:selectedCategories, user_select_id:selectedIds});
                  }}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              columnWrapperStyle={{
                justifyContent: "space-between",
                margin: 10,
              }}
              numColumns={3}
              scrollEnabled={false}
            />
          </View>
        <View
          style={{
            paddingVertical: 15,
          }}
        >
          {selectedCategories.length > 0 &&
            <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 5}}>
              {selectedCategories.map((category: any) => 
                (
                  <Text style={{color: '#67D393', fontWeight: '700', fontSize: 16}}>
                    #{category.name+' '}
                  </Text>
                )
              )}
              <Text style={{color: '#67D393', fontWeight: '700', fontSize: 16}}>
                과 관련된 정보들
              </Text>
            </View>
          }
          <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                flex: 1
              }}
            >
              사슴의 추천글
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
              navigation.navigate("PostList", {
                board_name: "사슴의 추천글",
              });
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
              <Arrow width={12} height={12} color={'black'} />
            </TouchableOpacity>
          </View>
          <CardView
            gap={0}
            offset={0}
            data={chunkArray(posts, 3)}
            pageWidth={width}
            dot={true}
            onEndDrag={() => posts.length >= 9 && navigation.navigate('PostList', { board_name: '사슴의 추천글'})}
            from='forest'
            renderItem={({ item }: any) => {
              return (
                <FlatList
                  data={item}
                  scrollEnabled={false}
                  renderItem={({ item }: any) => {
                    const {
                      id,
                      title,
                      preview,
                      writer,
                      photos,
                      rep_pic,
                      comment_cnt,
                      like_cnt,
                      user_likes
                    } = item;
                    return (
                      <PostItem
                        key={id}
                        post_id={id}
                        title={title}
                        preview={preview}
                        writer={writer}
                        photos={photos}
                        rep_pic={rep_pic}
                        comment_cnt={comment_cnt}
                        like_cnt={like_cnt}
                        user_likes={user_likes}
                        onRefresh={onRefresh}
                        isLogin={isLogin}
                        navigation={navigation}
                      />
                    );
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: "#F1FCF5",
            padding: 20
          }}
        >
          <Text style={{color: '#3C3C3C', fontWeight: '700', fontSize: 16, lineHeight: 22}}>{isLogin ? `${nickname}님 이 정보들은 어떠신가요?` : '이 정보들은 어떠신가요?'}</Text>
          <FlatList
            data={posts.slice(0,3)}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => {navigation.navigate('PostDetail', {post_id: item.id})}}>
                <View style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 4, backgroundColor: 'white'}}>
                  <Text style={{color: '#67D393', fontSize: 10, fontWeight: '600'}}>#{item.semi_categories[0].name}</Text>
                </View>
                <Text style={{color: '#3C3C3C', fontSize: 12, lineHeight: 18, marginLeft: 5}} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View
          style={{
            paddingVertical: 15,
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 15}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                flex: 1
              }}
            >
              사슴의 인기글
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
              navigation.navigate("PostList", {
                board_name: "사슴의 인기글"
              });
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
              <Arrow width={12} height={12} color={'black'} />
            </TouchableOpacity>
          </View>
          <CardView
            gap={0}
            offset={0}
            data={chunkArray(hotPosts, 3)}
            pageWidth={width}
            dot={true}
            onEndDrag={() => navigation.navigate('PostList', { board_name: '사슴의 인기글'})} 
            renderItem={({ item }: any) => {
              return (
                <FlatList
                  data={item}
                  scrollEnabled={false}
                  renderItem={({ item }: any) => {
                    const {
                      id,
                      title,
                      preview,
                      writer,
                      photos,
                      rep_pic,
                      comment_cnt,
                      like_cnt,
                      user_likes
                    } = item;
                    return (
                      <HotPostItem
                        key={id}
                        post_id={id}
                        title={title}
                        preview={preview}
                        writer={writer}
                        photos={photos}
                        rep_pic={rep_pic}
                        comment_cnt={comment_cnt}
                        like_cnt={like_cnt}
                        user_likes={user_likes}
                        onRefresh={onRefresh}
                        isLogin={isLogin}
                        navigation={navigation}
                      />
                    )
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            paddingVertical: 15,
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                flex: 1
              }}
            >
              사슴의 최신글
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
              navigation.navigate("PostList", {
                board_name: "사슴의 최신글",
              });
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
              <Arrow width={12} height={12} color={'black'}/>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newPosts}
            scrollEnabled={false}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({ item }: any) => {
              const {
                id,
                title,
                preview,
                writer,
                photos,
                rep_pic,
                comment_cnt,
                like_cnt,
                user_likes
              } = item;
              return (
                <PostItem
                  key={id}
                  post_id={id}
                  title={title}
                  preview={preview}
                  writer={writer}
                  photos={photos}
                  rep_pic={rep_pic}
                  comment_cnt={comment_cnt}
                  like_cnt={like_cnt}
                  user_likes={user_likes}
                  onRefresh={onRefresh}
                  isLogin={isLogin}
                  navigation={navigation}
                />
              );
            }}
          />
        </View>
      </ScrollView>
      <PlusButton
        onPress={() => {
          if(!isLogin) {
            Alert.alert(
              "로그인이 필요합니다.",
              "로그인 항목으로 이동하시겠습니까?",
              [
                {
                  text: "이동",
                  onPress: () => navigationToTab.navigate('마이페이지', {})
      
                },
                {
                  text: "취소",
                  onPress: () => { },
                  style: "cancel"
                },
              ],
              { cancelable: false }
            );
          }
          else {
            navigation.navigate('PostUpload', {});
          }
        }}
        position="rightbottom" />
      { isLogin && <UserCategories modalVisible={modalVisible} setModalVisible={setModalVisible} categories={boardLists} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default BoardListScreen;
