import { SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList, Alert, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { useState, useEffect, useRef, useContext } from 'react';
import { Request } from '../../common/requests';
import Heart from '../../common/Heart';
import {Comment} from './components/Comment';
import {WriteComment} from './components/WriteComment';
import Arrow from '../../assets/img/common/Arrow.svg';
import CardView from '../../common/CardView';
import CommentIcon from '../../assets/img/Story/Comment.svg';
import PopComment from "../../common/PopComment";
import StoryDetailBox, { StoryDetail } from './components/StoryDetailBox';
import { StoryProps } from '../../pages/Story';
import { LoginContext } from '../../common/Context';
import ShareButton from "../../common/ShareButton";
import Report from '../../common/Report';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParams } from '../../pages/Home';
import { useNavigation } from '@react-navigation/native';
import { TabProps } from '../../../App';
import FastImage from 'react-native-fast-image';

interface PostRecommendSectionProps {
  curations: any;
  stories: any;
  navigation: any;
}

interface BottomBarSectionProps {
  post: any;
  email: string;

  onRefresh: any;
  navigation: any;
}

const { width, height } = Dimensions.get('screen');

const PostRecommendSection = ({ curations, stories, navigation }: PostRecommendSectionProps) => {
  const navigationHome = useNavigation<StackNavigationProp<TabProps>>();
  return (
    <View>
      {curations.length > 0 &&
      <>
      <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10, flex: 1 }}>스토리가 포함된 큐레이션</Text>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {navigation.navigate('RecommendList', {data: curations, type: false})}}>
          <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
          <Arrow width={12} height={12} color={'black'}/>
        </TouchableOpacity>
      </View>
      <CardView 
        gap={0}
        offset={12}
        data={curations}
        pageWidth={width*0.6}
        dot={false}
        renderItem={({item}: any) => (
          <TouchableOpacity style={{marginHorizontal: 8}} onPress={() => { navigationHome.navigate('홈', { id: item.id }) }}>
            <FastImage
              style={{width: width*0.5, height: width*0.5, borderRadius: 5}}
              source={{uri: item.rep_pic}}
              resizeMode='cover'
            >
              <View style={{width: width*0.5, height: width*0.5, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end'}}>
                <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 10, marginLeft: 10, color: 'white'}}>{item.title}</Text>
              </View>
            </FastImage>
          </TouchableOpacity>
        )}
      />
      </>}
    {stories.length > 0 &&
    <>
    <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10, flex: 1 }}>이 장소의 다른 스토리</Text>
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {navigation.navigate('RecommendList', {data: stories, type: true})}}>
        <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
        <Arrow width={12} height={12} color={'black'}/>
      </TouchableOpacity>
    </View>
    <CardView 
      gap={0}
      offset={12}
      data={stories}
      pageWidth={width*0.6}
      dot={false}
      renderItem={({item}: any) => (
        <TouchableOpacity style={{marginHorizontal: 8}} onPress={() => navigation.push('StoryDetail', { id: item.id })}>
          <FastImage
            style={{width: width*0.5, height: width*0.25, borderRadius: 5}}
            source={{uri: item.rep_pic}}
            resizeMode='cover'
          >
            <View style={{width: width*0.5, height: width*0.25, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end'}}>
              <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 10, marginLeft: 10, color: 'white'}}>{item.title}</Text>
            </View>
          </FastImage>
        </TouchableOpacity>
      )}
    />
    </>}                       
    </View>
  )
}

const BottomBarSection = ({ post, email, onRefresh, navigation }: BottomBarSectionProps) => {
  const [like, setLike] = useState<boolean>(post.story_like)
  const request = new Request();
  const [commentPopupVisible, setCommentPopupVisible] = useState<boolean>(false);
  const toggleLike = async () => {
    if (email) {
      const response = await request.post(`/stories/${post.id}/story_like/`);
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
        <Text style={{fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3, marginRight: 10}}>{post.like_cnt}</Text>
        <TouchableOpacity onPress={openCommentPopup}>
          <CommentIcon color={'#202020'} />
        </TouchableOpacity>
        <Text style={{fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3}}>{post.comment_cnt}</Text>
      </View>
      <PopComment
            data={post} post_id={post.id} email={email} isLogin={!!email} navigation={navigation} repo={false} modalVisible={commentPopupVisible}  setModalVisible={setCommentPopupVisible}/>
      <ShareButton color={'black'} message={`[SASM Story] ${post.title}`} description={post.html_content} image={post.rep_pic} id={post.id} />
    </View>
  )
}

const StoryDetailPage = ({ navigation, route }: StoryProps) => {
  const id = route.params.id;
  const scrollRef = useRef<FlatList>(null);
  const { isLogin, setLogin } = useContext(LoginContext);
  const [data, setData] = useState<StoryDetail>();
  const [comment, setComment] = useState([] as any);
  const [curations, setCurations] = useState([] as any);
  const [otherStories, setOtherStories] = useState([] as any);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [updateText, setUpdateText] = useState<string>('');
  const [commentId, setCommentId] = useState<number>(0);
  const [reported, setReported] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const request = new Request();

  const checkUser = async () => {
    const response = await request.get(`/mypage/me/`, {}, {});
    setEmail(response.data.data.email);
  }

  const loadItem = async () => {
    const response_detail = await request.get(`/stories/story_detail/${id}/`);
    const response_comment = await request.get("/stories/comments/", { story: id }, null);
    const response_curation = await request.get(`/stories/story_included_curation/${id}/`);
    const response_stories = await request.get(`/stories/same_place_story/${id}/`);
    setData(response_detail.data.data);
    setComment(response_comment.data.data.results);
    setCurations(response_curation.data.data);
    setOtherStories(response_stories.data.data);
  };

  const reRenderScreen = () => {
    setRefreshing(true);
    setUpdateText('');
    setRefreshing(false);
  }

  const deleteStory = async () => {
    const _delete = async () => {
      await request.delete(`/stories/${id}/delete/`, {});
      navigation.goBack();
    }
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
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  }

  const onReport = async (item: any) => {
    const response = await request.post('/report/create/', {
      target: `story:post:${id}`,
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

  // const scrollToComment = () => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollToOffset({ animated: true, offset: headerHeight })
  //   }
  // }

  useEffect(() => {
    if (isLogin) checkUser();
  }, [isLogin]);

  useEffect(() => {
    loadItem();
  }, [refreshing]);


  return (
    <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={0} style={{flex: 1, backgroundColor: '#FFFFFF'}}>
    <BottomSheetModalProvider>
    <View style={{flex: 1, backgroundColor: 'white'}}>
        {data == undefined ? (
            <ActivityIndicator />
        ) : (
            <>
            <FlatList
                ref={scrollRef}
                data = {comment.slice(0,3)}
                onRefresh = {reRenderScreen}
                refreshing = {refreshing}
                keyExtractor={(item, index) => item.id.toString()}
                ListHeaderComponent={
                <>
                    <StoryDetailBox data={data} navigation={navigation} isLogin={isLogin} email={email} onLayout={onLayout} onRefresh={reRenderScreen} onReport={() => setModalVisible(true)} onDelete={deleteStory} onUpdate={()=>navigation.replace('WriteStory', { story: data })}/>
                    <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginTop: 40}} />
                    <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10 }}>한줄평</Text>
                        <CommentIcon color={'black'}/>
                      </View>
                      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {navigation.navigate('CommentList', { id: id, email: email })}}>
                        <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
                        <Arrow width={12} height={12} color={'black'} />
                      </TouchableOpacity>
                    </View>
                    <WriteComment id = {id} reRenderScreen = {reRenderScreen} data={updateText} commentId={commentId} isLogin={isLogin} navigation={navigation} />
                </>}
                renderItem = {({item}) => { 
                    return (
                        <Comment data = {item} story_id={id} reRenderScreen = {reRenderScreen} email={email} callback={callback} isLogin={isLogin} navigation={navigation}/>
                    )
                }}
                ListFooterComponent = {
                <>
                    <PostRecommendSection curations={curations} stories={otherStories} navigation={navigation} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                        <TouchableOpacity onPress={scrollToTop} style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                            <Arrow width={18} height={18} transform={[{rotate: '270deg'}]} color={'#666666'} style={{marginRight: 5}} />
                            <Text style={{color: '#666666', fontWeight: '600', marginTop: 3}}>맨 위로 이동</Text>
                        </TouchableOpacity>
                    </View>
                </>}
            />
            <BottomBarSection post={data} email={email} navigation={navigation} onRefresh={reRenderScreen} />
            <Report reported={reported} modalVisible={modalVisible} setModalVisible={setModalVisible} onReport={onReport} />
            </>
        )}
    </View>
    </BottomSheetModalProvider>
    </KeyboardAvoidingView>
)}

export default StoryDetailPage;