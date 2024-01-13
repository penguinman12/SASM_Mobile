import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import { TextPretendard as Text } from "../../common/CustomText";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import RenderHTML from 'react-native-render-html';
import Heart from "../../common/Heart";
import Arrow from "../../assets/img/common/Arrow.svg";
import ReportIcon from '../../assets/img/common/Report.svg';
import {WriteComment} from "./components/WriteComment";
//PopComent 불러옴
import PopComment from "../../common/PopComment";
import {Comment} from "./components/Comment";
import CommentIcon from '../../assets/img/Story/Comment.svg';
import { LoginContext } from "../../common/Context";
import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import CardView from "../../common/CardView";
import Report from "../../common/Report";
import ShareButton from "../../common/ShareButton";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Settings from '../../assets/img/MyPage/Settings.svg';
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TabProps } from "../../../App";
import { getStatusBarHeight } from 'react-native-safearea-height';
import FastImage from "react-native-fast-image";

interface Post {
  id: number;
  board: number;
  title: string;
  subtitle: string;
  category: any;
  content: string;
  writer: any;
  created: string;
  updated: string;
  like_cnt: number;
  comment_cnt: number;
  viewCount: number;
  user_likes: boolean;
  rep_pic: string;
  writer_is_followed: boolean;
  photos: Array<string>;
  hashtags: Array<string>;
  semi_categories: Array<string>;
}

interface PostDetailSectionProps {
  post: Post;
  email: string;
  onReport: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onLayout: any;
}

interface UserInfoSectionProps {
  user: any;
  posts: any;
  isLogin: boolean;
  navigation: any;
  onRefresh: any;
  writer_is_followed: boolean;
}

interface PostRecommendSectionProps {
  data: any;
  navigation: any;
}

const { width, height } = Dimensions.get('screen');

const PostDetailSection = ({
  post,
  email,
  onUpdate,
  onDelete,
  onReport,
  onLayout
}: PostDetailSectionProps) => {
  const [dot, setDot] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<TabProps>>();
  const user = Boolean(post.writer.email === email);
  const statusBarHeight = getStatusBarHeight();
  const markup = {
    html: `${post?.content}`
  }

  const renderersProps = useMemo(
    () => ({
      img: {
        enableExperimentalPercentWidth: true
      }
    }),
    [post]
  )

  const tagsStyles = useMemo(
    () => ({
      div: {
        fontSize: 16,
        lineHeight: 30,
        letterSpacing: -0.6
      }
    }),
    [post]
  )

  return (
    <View onLayout={onLayout}>
      <FastImage
        style={{ height: 400 }}
        source={{
          uri: post.rep_pic,
          priority: FastImage.priority.normal
        }}
      >
        <View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: width, height: 400}}>
        <View
          style={{
            flexDirection: "row",
            marginTop: statusBarHeight,
            alignSelf: "center",
            flex: 1,
            paddingHorizontal: 10
          }}
        >
          <TouchableOpacity style={{ marginTop: 5, width: 30, height: 30 }} onPress={() => { navigation.goBack() }}>
            <Arrow width={18} height={18} transform={[{ rotate: '180deg' }]} color={'white'} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              textAlign: 'center',
              flex: 1,
              color: 'white'
            }}
           >
             {post.category.name}
          </Text>
          { email && 
            <TouchableOpacity style={{marginTop: 10, marginRight: 10, width: 30, height: 30, alignItems: 'flex-end'}} onPress={() => setDot(!dot)}>
              <Settings transform={[{ rotate: dot ? '90deg' : '0deg'}]} color={'white'}/>
            </TouchableOpacity>
          }
          { dot &&
          <View style={{position: 'absolute', backgroundColor: 'white', top: 40, left: width-140, borderRadius: 4}}>
            <TouchableOpacity style={{borderColor: 'rgba(168, 168, 168, 0.20)', borderBottomWidth: 1, paddingHorizontal: 40, paddingVertical: 10}} onPress={onUpdate} disabled={!user}>
              <Text style={{fontSize: 14, lineHeight: 20, letterSpacing: -0.6, opacity: user ? 1 : 0.4}}>수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderColor: 'rgba(168, 168, 168, 0.20)', borderBottomWidth: 1, paddingHorizontal: 40, paddingVertical: 10}} onPress={onDelete} disabled={!user}>
              <Text style={{fontSize: 14, lineHeight: 20, letterSpacing: -0.6, opacity: user ? 1 : 0.4}}>삭제하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingHorizontal: 40, paddingVertical: 10}} onPress={onReport} disabled={user}>
              <Text style={{fontSize: 14, lineHeight: 20, letterSpacing: -0.6, opacity: !user ? 1 : 0.4}}>신고하기</Text>
            </TouchableOpacity>
          </View>}
        </View>
        <View style={{ flex: 1, padding: 20, justifyContent: 'flex-end' }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 15,
              color: "white",
            }}
            numberOfLines={2}
          >
            {post.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#F4F4F4",
              marginBottom: 15,
              opacity: 0.8,
            }}
            numberOfLines={2}
          >
            {post.subtitle}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: '#F4F4F4', fontSize: 12, fontWeight: '400' }}>작성: {post.created.slice(0, 10).replace(/-/gi, '.')}</Text>
            <Text style={{ color: '#F4F4F4', fontSize: 12, fontWeight: '400' }}> / 마지막 수정: {post.updated.slice(0, 10).replace(/-/gi, '.')}</Text>
            <Text style={{ flex: 1, textAlign: 'right', color: '#67D393', fontSize: 14, fontWeight: '400' }}>{post.writer.nickname}</Text>
          </View>
        </View>
        </View>
      </FastImage>
      <View style={{ padding: 15 }}>
        <RenderHTML
          contentWidth={width}
          source={markup}
          renderersProps={renderersProps}
          tagsStyles={tagsStyles}
          // renderers={renderers}
        />
        <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {post.hashtags && (
              post.hashtags.map((name, index) => {
                return (
                  <Text style={{ color: '#848484', fontSize: 14 }} key={index}>#{name} </Text>
                )
              })
            )}
          </View>
        </View>
        <View style={{ alignItems: 'flex-start' }}>
          <CardView data={post.semi_categories} offset={0} gap={0} pageWidth={100} dot={false} renderItem={({ item }: any) => {
            return (
              <View style={{ borderRadius: 16, backgroundColor: '#67D393', paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{item.name}</Text>
              </View>
            )
          }} />
        </View>
      </View>
    </View>
  );
};


const UserInfoSection = ({
  user, posts, isLogin, navigation, onRefresh, writer_is_followed
}: UserInfoSectionProps) => {
  const [follow, setFollow] = useState<boolean>(writer_is_followed);
  const request = new Request();
  const onFollow = async () => {
    if (isLogin) {
      const response = await request.post('/mypage/follow/', {
        targetEmail: user.email
      }, {});
      if(response.data.status==='success'){
        setFollow(response.data.data.follows);
        onRefresh();
      }
      else{
        Alert.alert(
            `${response.data.message}`
         )
      }
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
          {
            text: "이동",
            onPress: () => navigation.navigate('마이페이지', {})

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
  }
  
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 15,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: "#E3E3E3",
        borderBottomColor: "#E3E3E3",
      }}
    >
      
      
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={() => { navigationToTab.navigate('마이페이지', { email: user.email }) }}> 
        {/*email은 user에 들어있음(user.writer)*/}
        <Image
          style={{ width: 56, height: 56, borderRadius: 60 }}
          source={{
            uri: user.profile,
          }}
        />
        </TouchableOpacity>

        <TouchableOpacity style={{ borderColor: '#67D393', borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 15, marginTop: 15 }} onPress={onFollow}>
          <Text style={{ color: '#202020', fontSize: 12 }}>{follow ? '팔로잉' : '+ 팔로우'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginLeft: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 15}}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: user.is_verified ? '#209DF5' : '#67D393' }}>{user.is_verified ? 'Editor' : 'User'}</Text>
          <Text style={{ color: '#202020', fontSize: 14, fontWeight: '600' }}> {user.nickname}님의 다른 글</Text>
        </View>
        <FlatList data={posts.slice(0,4)} scrollEnabled={false} renderItem={({ item }: any) => {
          return (
            <TouchableOpacity style={{ borderBottomColor: '#EDF8F2', borderBottomWidth: 0.5 }} onPress={() => { navigation.push('PostDetail', { post_id: item.id }) }}>
              <Text style={{ color: '#3C3C3C', fontSize: 10, lineHeight: 18, opacity: 0.6, overflow: 'hidden' }} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )
        }} />
      </View>
    </View>
  );
};

const PostRecommendSection = ({ data, navigation }: PostRecommendSectionProps) => {
  return (
    <View style={{
      marginVertical: 20,
      padding: 20,
      borderTopWidth: 2,
      borderBottomWidth: 2,
      borderTopColor: "#E3E3E3",
      borderBottomColor: "#E3E3E3",
    }}>
      <Text style={{color: '#202020', fontSize: 16, fontWeight: '700', marginBottom: 10}}>추천글</Text>
      <CardView
        gap={0}
        offset={0}
        dot={false}
        pageWidth={120}
        data={data}
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.push('PostDetail', {post_id: item.id})}>
              <FastImage
                source={{ uri: item.rep_pic, priority: FastImage.priority.normal }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 4
                }}
              >
                <View style={{backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 4, width: 120, height: 120, alignItems: "center", justifyContent: "center"}}>
                <Text style={{ color: "white", fontSize: 14, lineHeight: 20, letterSpacing: -0.6, fontWeight: 400, overflow: 'hidden', textAlign: 'center' }}>{item.title}</Text>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 5, right: 5 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: item.writer.is_verified ? '#209DF5' : '#67D393' }}>{item.writer.is_verified ? 'Editor' : 'User'}</Text>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}> {item.writer.nickname}</Text>
                </View>
                </View>
              </FastImage>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

interface BottomBarSectionProps {
  post: Post;
  email: string;
  onRefresh: any;
  navigation: any;
}

const BottomBarSection = ({ post, email, onRefresh, navigation }: BottomBarSectionProps) => {
  const [like, setLike] = useState<boolean>(post.user_likes)
  const request = new Request();
  const [commentPopupVisible, setCommentPopupVisible] = useState<boolean>(false);

  const toggleLike = async () => {
    if (email) {
      const response = await request.post(`/forest/${post.id}/like/`);
      setLike(!like);
      onRefresh();
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
          {
            text: "이동",
            onPress: () => navigation.navigate('마이페이지', {})

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
  };

  const openCommentPopup = () => {
    setCommentPopupVisible(true);
  };

  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <Heart color={'#202020'} like={like} onPress={toggleLike} size={18} ></Heart>
        <Text style={{ fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3, marginRight: 10 }}>{post.like_cnt}</Text>
        <TouchableOpacity onPress={openCommentPopup}>
          <CommentIcon color={'#202020'} />
        </TouchableOpacity>
        <Text style={{ fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3 }}>{post.comment_cnt}</Text>
      </View>
      <ShareButton color={'black'} message={`[SASM Forest] ${post.title}`} description={post.content} image={post.rep_pic} id={post.id} />
      <PopComment data={post} post_id={post.id} email={email} isLogin={!!email} navigation={navigation} repo={true} modalVisible={commentPopupVisible}  setModalVisible={setCommentPopupVisible}/>
    </View>
  )
}

const PostDetailScreen = ({
  navigation,
  route,
}: StackScreenProps<ForestStackParams, "PostDetail">) => {
  const scrollRef = useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState([] as any);
  const [commentId, setCommentId] = useState<number>(0);
  const [user, setUser] = useState([] as any);
  const [updateText, setUpdateText] = useState<string>('');
  const [writerPosts, setWriterPosts] = useState([] as any);
  const [reported, setReported] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [recommend, setRecommend] = useState([] as any);
  const {isLogin, setLogin} = useContext(LoginContext);
  const request = new Request();
  const post_id = route.params.post_id;

  const checkUser = async () => {
    const response = await request.get(`/mypage/me/`, {}, {});
    setUser(response.data.data);
  }

  const loadItem = async () => {
    const response_detail = await request.get(`/forest/${post_id}/`, {}, {});
    setPost(response_detail.data.data);
    const response_comment = await request.get(`/forest/${post_id}/comments/`, {}, {});
    setComment(response_comment.data.data.results);
    const response_writer = await request.get('/forest/', { writer_filter: response_detail.data.data.writer.email })
    setWriterPosts(response_writer.data.data.results);
    const response_recommend = await request.get('/forest/', { category_filter: response_detail.data.data.category.id,})
    setRecommend(response_recommend.data.data.results);
  };

  const reRenderScreen = () => {
    setRefreshing(true);
    setUpdateText('');
    setRefreshing(false);
  };

  const deletePost = async () => {
    const _delete = async () => {
      await request.delete(`/forest/${post_id}/delete/`);
      navigation.goBack();
    };
    Alert.alert(
      "게시글 삭제 확인",
      "정말로 삭제하시겠습니까?",
      [
        {
          text: "삭제",
          onPress: () => _delete(),
        },
        {
          text: "취소",
          onPress: () => { },
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };


  const onReport = async (item: any) => {
    const response = await request.post('/report/create/', {
      target: `forest:post:${post_id}`,
      reason: item
    }, {});
    setReported(item)
  }

  const callback = (text: string, id: number) => {
    setUpdateText(text);
    setCommentId(id);
  }

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const onLayout = (e: any) => {
    const { height } = e.nativeEvent.layout;
    setHeaderHeight(height);
  }

  useEffect(() => {
    if (isLogin) checkUser();
  }, [isLogin]);

  useEffect(() => {
    loadItem();
  }, [refreshing]);

  return (
    <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={0} style={{flex: 1, backgroundColor: '#FFFFFF'}}>
    <BottomSheetModalProvider>
    <View style={styles.container}>
      {post == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            ref={scrollRef}
            data={comment.slice(0,3)}
            style={styles.container}
            onRefresh={reRenderScreen}
            refreshing={refreshing}
            ListHeaderComponent={
              <>
                <PostDetailSection post={post} email={user.email} onReport={() => setModalVisible(true)} onDelete={deletePost} onUpdate={()=>navigation.replace('PostUpload', {post: post})} onLayout={onLayout} />
                <UserInfoSection user={post.writer} posts={writerPosts.filter((item: any) => item.id !== post.id)} isLogin={isLogin} navigation={navigation} onRefresh={reRenderScreen} writer_is_followed={post.writer_is_followed}/>
                <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10 }}>한줄평</Text>
                    <CommentIcon color={'black'} />
                  </View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('PostComments', { id: post_id, email: user.email }) }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
                    <Arrow width={12} height={12} color={'black'} />
                  </TouchableOpacity>
                </View>
                <WriteComment id={post_id} reRenderScreen={reRenderScreen} data={updateText} commentId={commentId} isLogin={isLogin} navigation={navigation} />
              </>
            }
            ListFooterComponent={
              <>
                <PostRecommendSection data={recommend.filter((item: any) => item.id !== post.id)} navigation={navigation}/>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                  <TouchableOpacity onPress={scrollToTop} style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <Arrow width={18} height={18} transform={[{rotate: '270deg'}]} color={'#666666'} style={{marginRight: 5}} />
                    <Text style={{color: '#666666', fontWeight: '600', marginTop: 3}}>맨 위로 이동</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            renderItem={({ item }) => {
              return (
                <Comment data={item} reRenderScreen={reRenderScreen} post_id={post_id} email={user.email} isLogin={isLogin} navigation={navigation} callback={callback}/>
              )
            }}
          />
          <BottomBarSection post={post} email={user.email} navigation={navigation} onRefresh={reRenderScreen} />
          <Report reported={reported} modalVisible={modalVisible} setModalVisible={setModalVisible} onReport={onReport} />
        </>
      )}
    </View>
    </BottomSheetModalProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default PostDetailScreen;