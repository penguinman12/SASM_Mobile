import React, { useEffect, useState, useCallback, useRef, useContext, Dispatch, SetStateAction } from 'react';
import { Dimensions, Image, View, TouchableOpacity, StyleSheet, Button, Linking, Modal, SafeAreaView, Alert, Share, ImageBackground } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { detailDataProps } from '../Map';
import OpenTime from "../../../assets/img/PlaceDetail/OpenTime.svg";
import PlaceMarker from "../../../assets/img/PlaceDetail/PlaceMarker.svg";
import PlaceNumber from "../../../assets/img/PlaceDetail/PlaceNumber.svg";
import PlaceHour from "../../../assets/img/PlaceDetail/PlaceHour.svg";
import PlaceInfo from "../../../assets/img/PlaceDetail/PlaceInfo.svg";
import Heart from '../../../common/Heart';
import { Request } from '../../../common/requests';
import WriteReview from './WriteReview';
import UserReviews from './UserReviews';
import LikePlace from "../../../assets/img/Map/LikePlace.svg";
import FilledLikePlace from "../../../assets/img/Map/FilledLikePlace.svg";
import PlusWhite from "../../../assets/img/Map/PlusWhite.svg";
import CardView from '../../../common/CardView';
import ToggleOpen from "../../../assets/img/Map/ToggleOpen.svg";
import ArrowTop from "../../../assets/img/common/ArrowTop.svg";
import { StoryDetail } from '../../story/components/StoryDetailBox';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabProps } from '../../../../App';
import { LoginContext } from '../../../common/Context';
import ShareButton from "../../../common/ShareButton";
import { CategoryIcon } from '../../../common/Category';
import Arrow from '../../../assets/img/common/Arrow.svg';
import { NumberArray } from 'react-native-svg';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

const TextBox = styled.View`
  position: absolute;
  top: 200px
  left: 0px;
  padding-horizontal: 27px;
`
const TabsBox = styled.View`
  width:100%;
  display: flex;
  flex-direction: row;
  padding-horizontal: 20px;
  justify-content: space-around;
`
const ButtonBox = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 125px;
  position: absolute;
  right: 15px;
  top: 100px;
`
const IconTextBox = styled.View`
  display: flex;
  flex-direction: row;
  border-bottom-width: 1px;
  border-color:  #E3E3E3;
  padding-vertical: 16px;
  align-items: center;
  & : last-of-type  {
    border-width: 0px;
  }
`
const TabButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 20%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom-width: 2px;
  border-color: ${props => props.selected ? '#67D393' : '#E3E3E3'};
`
const Section = styled.View`
  min-height: 200px;
`
const Box = styled.View`
  border-color: #DDDDDD;
  border-bottom-width: 1px;
  padding-vertical: 27px;
`

const TabText = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: ${props => props.selected ? '#000000' : '#C0C0C0'}
`
const StorySection = styled.TouchableOpacity`
  width: ${width - 54}px;
  margin: 27px;
  position: relative;
`
const MenuBox = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 27px;
`

interface DetailCardProps {
  detailData: detailDataProps;
  setIndex: Dispatch<SetStateAction<number>>;
}
export interface reviewDataProps {
  category: any[];
  contents: string;
  created: string;
  id: number;
  nickname: string;
  photos: any[];
  place: number;
  updated: string;
  writer: string;
}

export default function DetailCard({ detailData, setIndex }: DetailCardProps): JSX.Element {
  const { isLogin, setLogin } = useContext(LoginContext);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps, '스토리'>>();
  const detailRef = useRef<ScrollView>(null);
  const [viewHours, setViewHours] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [targetId, setTargetId] = useState<number>(0);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const request = new Request();
  const [reviewData, setReviewData] = useState<reviewDataProps[]>();
  const [storyData, setStoryData] = useState<Array<StoryDetail>>([{
    id: 1,
    title: '',
    created: '',
    profile: '',
    rep_pic: '',
    extra_pics: [],
    story_review: '',
    tag: '',
    story_like: false,
    category: '',
    semi_category: '',
    place_name: '',
    views: 1,
    html_content: '',
    writer: '',
    nickname: '',
    map_image: '',
    writer_is_verified: '',
    preview: '',
  }]);
  const [likePlace, setLikePlace] = useState<boolean>(false);
  const [likeStory, setLikeStory] = useState<Array<boolean>>([false]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const tabs: { index: number, name: string }[] = [
    {
      index: 0,
      name: '홈',
    },
    {
      index: 1,
      name: '리뷰',
    },
    {
      index: 2,
      name: '스토리',
    }
  ]

  //화면 재 렌더링
  const rerenderScreen = () => {
    setRefresh(true);
    setRefresh(false);
  }

  const handlePlaceLike = async () => {
    if (!isLogin) {
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
      return;
    }
    const response = await request.post('/places/place_like/', { id: detailData.id });
    setLikePlace(!likePlace);
  }
  const handleStoryLike = async (id: number) => {
    if (!isLogin) {
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
      return;
    }
    const response = await request.post(`/stories/${id}/story_like/`);
    const tmp = [...likeStory];
    tmp[storyData.findIndex(item => item.id === id)] = !tmp;
    setLikeStory(tmp);
    rerenderScreen();
  }

  const getReview = async () => {
    const response_review = await request.get(`/places/place_review/`, { id: detailData.id });
    if (response_review.data.data.place_like == 'ok') {
      setLikePlace(true);
    }
    setReviewData(response_review.data.data.results);
  };
  const getStory = async () => {
    let stories = [];
    let likes = [];
    if (detailData.story_id.length > 0) {
      for (const id of detailData.story_id){
        const response_story = await request.get(`/stories/story_detail/${id}/`);
        stories.push(response_story.data.data);
        likes.push(response_story.data.data.story_like);
      }
      setLikeStory(likes);
      setStoryData(stories);
    }
    else return;
  }

  const scrollToTop = () => {
    if (detailRef.current) {
      detailRef?.current.scrollTo(0);
    }
  }

  useEffect(() => {
    if (detailData.place_like == 'ok') setLikePlace(true);
  }, [])

  useEffect(() => {
    getReview();
    getStory();
  }, [refresh]);

  return (
    <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' }}>
      <Modal style={{ position: 'absolute' }} visible={reviewModal}>
        <WriteReview rerender={rerenderScreen} id={detailData.id} place_name={detailData.place_name} category={detailData.category} setReviewModal={setReviewModal} setTab={setTab} />
      </Modal>
      <FlatList
        data={[detailData]}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.2}
        onEndReached={() => { setIndex(2); }}
        renderItem={({ item: detailData }: { item: detailDataProps }) =>
          <View>
            <View style={{ position: 'relative' }}>
              <FastImage source={{ uri: detailData!.rep_pic, priority: FastImage.priority.normal }} style={{ width: '100%', height: 350 }}>
                <View style={{ width: '100%', height: 350, backgroundColor: 'rgba(0,0,0,0.4)' }} />
              </FastImage>
            </View>
            <ButtonBox>
              <TouchableOpacity onPress={() => {
                if (!isLogin) {
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
                  return;
                }
                setReviewModal(true);
              }}>
                <PlusWhite />
              </TouchableOpacity>
              <Heart like={likePlace} onPress={handlePlaceLike} color={'white'} size={20}/>
              <ShareButton color='white' message={`[SASM Map] ${detailData.place_name} - ${detailData.category}`} image={detailData.rep_pic} description={detailData.place_review} id={detailData.id} />
            </ButtonBox>
            <TextBox>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <CategoryIcon data={detailData.category} />
                <Text style={TextStyles.category}>{detailData.category}</Text>
              </View>
              <Text style={TextStyles.place_name}>{detailData.place_name}</Text>
              <Text style={TextStyles.preview}>{detailData.place_review}</Text>
            </TextBox>
            <View>
              <TabsBox>
                {
                  tabs.map((data: { index: number, name: string }) => {
                    return (
                      <TabButton
                        key={data.index}
                        selected={tab == data.index}
                        onPress={() => { setTab(data.index) }}>
                        <TabText selected={tab == data.index}>{data.name}</TabText>
                      </TabButton>
                    )
                  })
                }
              </TabsBox>
              <View>
                {
                  {
                    0: <Section>
                      <Box style={{ paddingHorizontal: 10, paddingBottom: 0 }}>
                        <IconTextBox>
                          <PlaceMarker style={{ marginHorizontal: 16 }} />
                          <Text style={TextStyles.common}>{detailData.address}</Text>
                        </IconTextBox>
                        <IconTextBox>
                          <PlaceNumber style={{ marginHorizontal: 16 }} />
                          <TouchableOpacity onPress={() => { Linking.openURL(`tel:${detailData.phone_num}`) }}>
                            <Text style={TextStyles.common}>
                              {detailData.phone_num}
                            </Text>
                          </TouchableOpacity>
                        </IconTextBox>
                        <IconTextBox>
                          <PlaceHour style={{ marginHorizontal: 16 }} />
                          <Text style={TextStyles.common}>영업시간 | </Text>
                          <Text style={TextStyles.common}>
                            {detailData.open_hours}
                          </Text>
                          {
                            detailData.etc_hours &&
                            <>
                              <Text style={TextStyles.common}>브레이크타임 | </Text>
                              <Text style={TextStyles.common}>{detailData.etc_hours}</Text>
                            </>
                          }
                        </IconTextBox>
                        <IconTextBox>
                          <PlaceInfo style={{ marginHorizontal: 15 }} />
                          <Text style={{ ...TextStyles.common, flex: 1 }}>
                            {detailData.short_cur}
                          </Text>
                        </IconTextBox>
                        {detailData.pet_category && <IconTextBox><PlaceInfo style={{ marginHorizontal: 15 }} /><Text style={TextStyles.common}>반려동물 출입 가능</Text></IconTextBox>}
                        {detailData.reusable_con_category && <IconTextBox><PlaceInfo style={{ marginHorizontal: 15 }} /><Text style={TextStyles.common}>재사용 용기 사용 가능</Text></IconTextBox>}
                        {detailData.tumblur_category && <IconTextBox><PlaceInfo style={{ marginHorizontal: 15 }} /><Text style={TextStyles.common}>텀블러 할인 가능</Text></IconTextBox>}
                        {detailData.vegan_category && <IconTextBox><PlaceInfo style={{ marginHorizontal: 15 }} /><Text style={TextStyles.common}>비건 카테고리 : {detailData.vegan_category}</Text></IconTextBox>}
                      </Box>
                      <Box>
                        <CardView
                          pageWidth={160}
                          offset={20}
                          gap={8}
                          dot={false}
                          data={detailData.photos}
                          renderItem={({ item }: any) => <Image source={{ uri: item!.image }} style={{ width: 160, height: 160, marginHorizontal: 4 }} />}
                        />
                      </Box>
                      <Box>
                        <MenuBox>
                          <Text style={TextStyles.menu}>리뷰</Text>
                          <TouchableOpacity onPress={()=>{setTab(1)}} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text>더보기</Text>
                            <Arrow style={{ marginHorizontal: 7.5 }} color={'black'} />
                          </TouchableOpacity>
                        </MenuBox>
                        {
                          reviewData && <UserReviews category={detailData.category} place_name={detailData.place_name} place_rep_pic={detailData.rep_pic} rerender={rerenderScreen} reviewData={reviewData[0]} />
                        }
                      </Box>
                      <Box>
                        <MenuBox>
                          <Text style={TextStyles.menu}>스토리</Text>
                          <TouchableOpacity onPress={()=>{setTab(2)}} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text>더보기</Text>
                            <Arrow style={{ marginHorizontal: 7.5 }} color={'black'} />
                          </TouchableOpacity>
                        </MenuBox>
                        {
                          detailData.story_id.length > 0 && 
                          <StorySection onPress={() => { navigationToTab.navigate('스토리', { id: storyData[0].id }) }}>
                            <FastImage source={{ uri: storyData[0].rep_pic, priority: FastImage.priority.normal }} style={{ width: '100%', height: 450 }} />
                              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'absolute', width: '100%', height: '100%', paddingVertical: 35, paddingHorizontal: 20 }}>
                                <Text style={TextStyles.story_title}>{storyData[0].title}</Text>
                                <Text style={TextStyles.story_place_name}>{storyData[0].place_name}</Text>
                                <Text style={TextStyles.story_category}>{storyData[0].category}</Text>
                                <Text style={TextStyles.story_writer}>{storyData[0].nickname}님의 이야기</Text>
                                <Text numberOfLines={3} style={TextStyles.story_preview}>{storyData[0].preview}...더보기</Text>
                              </View>
                              <View style={{ position: 'absolute', top: 34, right: 30 }}>
                                <Heart color={'white'} size={20} like={likeStory[0]} onPress={() => handleStoryLike(storyData[0].id)} />
                              </View>
                            </StorySection>
                        }
                      </Box>
                    </Section>,
                    1: <Section>
                      {
                        reviewData && (
                          reviewData.length != 0 ? reviewData.map((data: reviewDataProps) => (
                            <UserReviews category={detailData.category} place_name={detailData.place_name} place_rep_pic={detailData.rep_pic} rerender={rerenderScreen} reviewData={data} />
                          ))
                            :
                            <Text style={{ margin: 15, fontWeight: '700', color: '#000000' }}>리뷰가 없습니다.</Text>
                        )
                      }
                    </Section>,
                    2: <Section>
                      {
                        detailData.story_id.length === 0 ? <Text style={{ margin: 15, fontWeight: '700', color: '#000000' }}>스토리가 없습니다.</Text> :
                          <FlatList
                            data = {storyData}
                            renderItem = {({item}: any) => {
                              const { id, rep_pic, title, place_name, category, nickname, preview } = item;
                              return (
                                <StorySection onPress={() => { navigationToTab.navigate('스토리', { id: id }) }}>
                                  <FastImage source={{ uri: rep_pic, priority: FastImage.priority.normal }} style={{ width: '100%', height: 450 }} />
                                  <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'absolute', width: '100%', height: '100%', paddingVertical: 35, paddingHorizontal: 20 }}>
                                    <Text style={TextStyles.story_title}>{title}</Text>
                                    <Text style={TextStyles.story_place_name}>{place_name}</Text>
                                    <Text style={TextStyles.story_category}>{category}</Text>
                                    <Text style={TextStyles.story_writer}>{nickname}님의 이야기</Text>
                                    <Text numberOfLines={3} style={TextStyles.story_preview}>{preview}...더보기</Text>
                                  </View>
                                  <View style={{ position: 'absolute', top: 34, right: 30 }}>
                                    <Heart color={'white'} size={20} like={likeStory[storyData.findIndex(item => item.id === id)]} onPress={() => handleStoryLike(id)} />
                                  </View>
                                </StorySection>
                            )}}
                          />
                      }
                    </Section>,
                  }[tab]
                }
              </View>
            </View>
          </View>
        }
      />
    </View>
  )
}

const TextStyles = StyleSheet.create({
  category: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.6,
    color: '#FFFFFF',
    marginLeft: 8.5
  },
  place_name: {
    fontSize: 28,
    letterSpacing: -0.6,
    color: '#FFFFFF',
    fontWeight: '700',
    marginVertical: 8
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.6,
    color: '#FFFFFF'
  },
  common: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 5
  },
  story_title: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  story_place_name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 10
  },
  story_category: {
    fontSize: 10,
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 7,
    paddingVertical: 2
  },
  story_writer: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 250,
    marginBottom: 10
  },
  story_preview: {
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  menu: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  }
})