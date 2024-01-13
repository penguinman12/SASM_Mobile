import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { reviewDataProps } from './DetailCard';
import styled from 'styled-components/native';
import Close from "../../../assets/img/common/Close.svg";
import ArrowWhite from "../../../assets/img/common/ArrowWhite.svg";
import { getNickname } from "../../../common/storage";
import { Request } from '../../../common/requests';
import WriteReview from './WriteReview';
import FastImage from 'react-native-fast-image';
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TabProps } from "../../../../App";

const Section = styled.SafeAreaView`
  height: 100%;
  background-color: #000000;
  position: relative;
  display: flex;
  justify-content: center;
`
const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px
  right: 20px;
`
const TextBox = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0%;
  height: 30%;
  padding: 20px;
`
const PageButton = styled.View`
  height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface ReviewDetailProps {
  reviewData: reviewDataProps;
  setDetailModal: Dispatch<SetStateAction<boolean>>;
  rerender: () => void;
  category: string;
  place_name: string;
  place_rep_pic: string;
}

export default function ReviewDetail({ reviewData, setDetailModal, rerender, category, place_name, place_rep_pic }: ReviewDetailProps): JSX.Element {
  const request = new Request();
  const { width, height } = Dimensions.get('window');
  const flatlistRef = useRef<FlatList>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isWriter, setIsWriter] = useState<boolean>(false);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const checkisWriter = async () => {
    const nickname = await getNickname();
    if (reviewData.nickname == nickname) setIsWriter(true);
  }

  useEffect(() => {
    checkisWriter();
  }, [])

  const deleteReview = async () => {
    const response_delete = await request.delete(`/places/place_review/${reviewData.id}/`);
    setDetailModal(false);
    rerender();
  }

  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();

  return (
    <Section>
      <Modal visible={reviewModal}>
        <WriteReview id={reviewData.place} place_name={place_name} setReviewModal={setReviewModal} rerender={rerender} category={category} setTab={() => { }} targetData={reviewData} />
      </Modal>
      <CloseButton onPress={() => { setDetailModal(false) }}>
        <Close color={'#FFFFFF'} />
      </CloseButton>
      <View>
        {
          reviewData.photos.length > 1 &&
          <>
            {
              currentIdx != 0 &&
              <PageButton style={{ left: 10 }}>
                <TouchableOpacity onPress={() => { flatlistRef.current?.scrollToIndex({ animated: true, index: currentIdx - 1 }) }}>
                  <ArrowWhite />
                </TouchableOpacity>
              </PageButton>
            }
            {currentIdx != reviewData.photos.length - 1 &&
              <PageButton style={{ right: 10 }}>
                <TouchableOpacity onPress={() => { flatlistRef.current?.scrollToIndex({ animated: true, index: currentIdx + 1 }) }}>
                  <ArrowWhite transform={[{ rotate: '180deg' }]} />
                </TouchableOpacity>
              </PageButton>
            }
          </>
        }
        {
          reviewData.photos.length > 0 ?
            <FlatList
              ref={flatlistRef}
              onScroll={(e) => { setCurrentIdx(Math.floor(e.nativeEvent.contentOffset.x / width)) }}
              data={reviewData.photos}
              pagingEnabled
              renderItem={({ item }: any) => <FastImage source={{ uri: item.imgfile, priority: FastImage.priority.normal }} style={{ width: width, height: height * 0.3 }} />}
              horizontal
            />
          :
          <FastImage source={{ uri: place_rep_pic, priority: FastImage.priority.normal }} style={{ width: width, height: height * 0.3 }} />
        }
      </View>
      <TextBox>
        <TouchableOpacity onPress={() => { navigationToTab.navigate('마이페이지', { email: reviewData.writer }) }}>
          <Text style={TextStyles.nickname}>{reviewData.nickname}</Text>
        </TouchableOpacity>
        
        <Text style={TextStyles.date}>{reviewData.created.slice(0, 10).replace(/-/gi, '.')}</Text>
        <Text style={TextStyles.content}>{reviewData.contents}</Text>
        {
          isWriter &&
          <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end' }}>
            <TouchableOpacity onPress={deleteReview}><Text style={TextStyles.button}>삭제하기</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { setReviewModal(true); }}><Text style={TextStyles.button}>수정하기</Text></TouchableOpacity>
          </View>
        }
      </TextBox>
    </Section >
  )
}

const TextStyles = StyleSheet.create({
  nickname: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  date: {
    color: '#FFFFFF',
    fontSize: 7,
    marginBottom: 10,
  },
  content: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 5,
  }
})
