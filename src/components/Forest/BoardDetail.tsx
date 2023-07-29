import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import ListHeader from "./components/ListHeader";
import PostItem, { HotPostItem } from "./components/PostItem";
import { useFocusEffect } from "@react-navigation/native";

import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import CardView from "../../common/CardView";
import { LoginContext } from "../../common/Context";
import PlusButton from "../../common/PlusButton";

const { width, height } = Dimensions.get("window");

const BoardDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "BoardDetail">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [semiCategories, setSemiCategories] = useState([] as any);
  const [checkedList, setCheckedList] = useState([] as any);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [posts, setPosts] = useState([] as any);
  const [hotPosts, setHotPosts] = useState([] as any);
  const [newPosts, setNewPosts] = useState([] as any);
  const {isLogin, setLogin} = useContext(LoginContext);
  const request = new Request();

  const board_category = route.params.board_category;

  const getUserInfo = async () => {
    const response = await request.get('/mypage/me/', {}, {});
    setNickname(response.data.data.nickname);
  }

  const getSemiCategories = async () => {
    const response = await request.get(`/forest/semi_categories/`, {category: board_category.id}, {});
    setSemiCategories(response.data.data.results);
  }

  const getPosts = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('semi_category_filters', category.id);
    }
    const response = await request.get(`/forest/?${params.toString()}`, {
      category_filter: board_category.id,
    }, null);
    const response_hot = await request.get(`/forest/?${params.toString()}`, {
      category_filter: board_category.id,
      order: 'hot'
    }, null);
    const response_new = await request.get(`/forest/?${params.toString()}`, {
      category_filter: board_category.id,
      order: 'latest'
    }, null);
    setPosts(response.data.data.results);
    setHotPosts(response_hot.data.data.results);
    setNewPosts(response_new.data.data.results);
  }

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

  useFocusEffect(useCallback(() => {
    if(isLogin) getUserInfo();
  }, [isLogin]))

  useEffect(() => {
    getSemiCategories();
  }, [refreshing])

  useFocusEffect(useCallback(() => {
    getPosts();
  }, [refreshing, checkedList]))

  return (
    <SafeAreaView style={styles.container}>
    <ListHeader board_name={board_category.name} navigation={navigation} />
    <ScrollView>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={{padding: 15, backgroundColor: '#F1FCF5'}}>
            <CardView gap={0} offset={0} pageWidth={width} dot={false} data={semiCategories} renderItem={({item}: any) => {
              return (
                <TouchableOpacity style={{borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, margin: 4, backgroundColor: selectedIds.includes(item.id) ? '#67D393' : 'white'}}
                onPress={() => {
                  if (selectedIds.includes(item.id)) {
                    setSelectedIds(selectedIds.filter(id => id !== item.id));
                    setCheckedList(checkedList.filter((category: any) => category.id !== item.id));
                  } else {
                    setSelectedIds([...selectedIds, item.id]);
                    setCheckedList([...checkedList, item]);
                  }
                }}
              >
                <Text style={{color: selectedIds.includes(item.id) ? 'white' : '#202020', fontSize: 14, fontWeight: selectedIds.includes(item.id) ? '600' : '400'}}># {item.name}</Text>
              </TouchableOpacity>
              )}}
            />
          </View>
          <View
              style={{
                paddingVertical: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PostList", {
                    board_name: "추천글",
                    board_category: board_category
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 15,
                  }}
                >
                  사슴의 추천글
                </Text>
              </TouchableOpacity>
              <CardView
                gap={0}
                offset={0}
                data={chunkArray(posts, 3)}
                pageWidth={width}
                dot={true}
                onEndDrag={() => posts.length >= 9 && navigation.navigate('PostList', { board_name: '사슴의 추천글'})} 
                renderItem={({ item }: any) => {
                  return (
                    <FlatList
                      data={item}
                      scrollEnabled={false}
                      renderItem={({item}: any) => {
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
                        )}}
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
              <Text style={{color: '#3C3C3C', fontWeight: '700', fontSize: 16, lineHeight: 22}}>{nickname}님 이 정보들은 어떠신가요?</Text>
              <FlatList
                data={posts.slice(0,3)}
                scrollEnabled={false}
                renderItem={({ item }: any) => (
                  <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => {navigation.navigate('PostDetail', {post_id: item.id})}}>
                    <View style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 4}}>
                      <Text style={{color: '#67D393', fontSize: 10, fontWeight: '600'}}>#ESG</Text>
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PostList", {
                    board_name: "인기글",
                    board_category: board_category
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                  }}
                >
                  사슴의 인기글
                </Text>
              </TouchableOpacity>
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
                      renderItem={({item}: any) => {
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
                        )}}
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PostList", {
                    board_name: "최신글",
                    board_category: board_category
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                  }}
                >
                  사슴의 최신글
                </Text>
              </TouchableOpacity>
              <FlatList
                data={newPosts}
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
            </View>
        </>
      )}
    </ScrollView>
    {isLogin &&
      <PlusButton
        onPress={() => navigation.navigate('PostUpload', {})}
        position="rightbottom" />
    }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "white",
  },
});

export default BoardDetailScreen;