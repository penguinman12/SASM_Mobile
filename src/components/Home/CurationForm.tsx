import React, { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Dimensions, TextInput, TouchableOpacity, Image, Modal, View, ActivityIndicator, ImageBackground, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { ScrollView } from 'react-native-gesture-handler';
import PhotoOptions, { PhotoResultProps } from '../../common/PhotoOptions';
import styled from 'styled-components/native';
import { Request } from '../../common/requests';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { HomeStackParams } from '../../pages/Home';
import SelectStoryModal from './FormModals/SelectStoryModal';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import AddColor from "../../assets/img/common/AddColor.svg";
import { getStatusBarHeight } from 'react-native-safearea-height';
import FormHeader from '../../common/FormHeader';
import FinishModal from '../../common/FinishModal';
import {LoginContext} from '../../common/Context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {TabProps} from '../../../App';
import CurationDetail, { CurationDetailProps, CuratedStoryProps } from './CurationDetail';

const { width, height } = Dimensions.get('window');

const ReppicBox = styled.TouchableOpacity`
  position: relative;
  height: ${height*0.9 / 2};
  display: flex;
  justify-content: center;
  background: #DADADA;
`
const InputTitle = styled.TextInput`
  border-color: white;
  border-bottom-width: 1px;
  position: absolute;
  bottom: 20px;
  width: 100%;
  color: white;
  font-size: 32px;
  padding-horizontal: 15px;
  font-weight: 700;
`
const Section = styled.View`
  padding: 15px;
`
const Button = styled.TouchableOpacity`
  width: 80px;
  height: 80px;
  border-radius: 3px;
  background-color: #D9D9D9; 
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
`
const StoryImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 3px;
  margin: 4px;
`
const StorySection = styled.View`
  display: flex;
  flex-flow: row wrap;
  margin-vertical: 20px;
`
const InputContent = styled.TextInput`
  padding: 15px;
  height: 200px;
  font-size: 14px;
  border: 1px solid #797979;
  border-radius: 5px;
  margin-bottom: 20px;
`
const Footer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

width - 320 - 30 / 8

interface FormProps {
  title: string;
  contents: string;
  // stories: string[];
  [index: string]: any;
}


export default function CurationForm({ navigation, route }: StackScreenProps<HomeStackParams, 'Form'>): JSX.Element {
  const [form, setForm] = useState<FormProps>({
    title: '',
    contents: '',
    // stories: [],
    
  });
  const [selectedStory, setSelectedStory] = useState<any[]>([]);
  const [rep_pic, setRep_pic] = useState<any>([{
    uri: '',
    width: 1,
    height: 1,
    fileName: '',
  }])
  const [selectStoryModal, setSelectStoryModal] = useState<boolean>(false);
  const request = new Request();
  const statusBarHeight = getStatusBarHeight();
  const iOS = Boolean(Platform.OS === 'ios');
  const hasUnsavedChanges = Boolean(form.title.length > 0 || form.contents.length > 0 || selectedStory.length > 0 || rep_pic[0].uri != '');
  const [modalVisible, setModalVisible] = useState(false);
  const [curationId, setCurationId] = useState<number>(0);
  const [curatedStory, setCuratedStory] = useState<CuratedStoryProps[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [curationDetail, setCurationDetail] = useState<CurationDetailProps>({
    contents: '',
    created: '',
    updated: '',
    like_curation: false,
    like_cnt: 0,
    map_image: '',
    rep_pic: '',
    title: '',
    nickname: '',
    profile_image: '',
    writer_email: '',
    writer_is_verified: false,
    writer_is_followed: false,
  });
  const [reppicSize, setReppicSize] = useState<{ width: number; height: number; }>({
    width: 1, height: 1
  })
  const [mapImageSize, setMapImageSize] = useState<{ width: number; height: number; }>({
    width: 1, height: 1
  }) 
  const [like, setLike] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(false);
  const handleCheckedList = (storyid:number ): void => {
    setSelectedStory(selectedStory.filter(element => (id?element.story_id: element.id)!=storyid));
  }
  const id= route.params?.id;
  const getCurationDetail = async () => {
    const response_detail = await request.get(`/curations/curation_detail/${id}/`);
    setCurationDetail(response_detail.data.data);
    Image.getSize(response_detail.data.data.rep_pic, (width, height) => { setReppicSize({ width: width, height: height }) });
    Image.getSize(response_detail.data.data.map_image, (width, height) => { setMapImageSize({ width: width, height: height }) })
  }
  const getCurationStoryDetail = async () => {
    
    const response_story_detail = await request.get(`/curations/curated_story_detail/${id}/`);
 
    setSelectedStory(response_story_detail.data.data);
  }
  const uploadCuration = async () => {
    if(id){
      const formData = new FormData();
      for (let i of Object.keys(form)) {
        formData.append(i, form[i]);
      }
  
      
      formData.append('photo_image_url', rep_pic[0].uri == ''?curationDetail.rep_pic: rep_pic[0].uri)
      if(rep_pic[0].uri != '' && (rep_pic[0].uri !== curationDetail.rep_pic)){
        formData.append('rep_pic', {
          uri: rep_pic[0].uri,
          name: rep_pic[0].fileName,
          type: rep_pic[0].uri.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
        })
      }
      for (let i of selectedStory) {
        formData.append('stories', (i.story_id||i.id));
        formData.append('short_curations', '.');
      }
      if (form.title.length == 0 || form.contents.length == 0) {
        Alert.alert('빈 칸을 전부 채워주세요.')
        return;
      }
      if (selectedStory.length < 3) {
        Alert.alert('최소 3개의 스토리를 선택해주세요.')
        return;
      }
      if(1) {
        form.title = curationDetail.title;
      }
      const response = await request.put(`/curations/curation_update/${id}/`,formData,{"content-Type": "multipart/form-data" });
      console.log(response.data.data.id)
      console.log(formData)
      setCurationId(response.data.data.id);
      setModalVisible(true);
    }
    else{
    const formData = new FormData();
    for (let i of Object.keys(form)) {
      formData.append(i, form[i]);
    }
    
    formData.append('rep_pic', {
        uri: rep_pic[0].uri,
        name: rep_pic[0].fileName,
        type: rep_pic[0].uri.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
      })

    for (let i of selectedStory) {
      formData.append('stories', i.id);
      formData.append('short_curations', '.');
    }

    if (form.title.length == 0 || form.contents.length == 0) {
      Alert.alert('빈 칸을 전부 채워주세요.')
      return;
    }
    if (rep_pic[0].uri == '') {
      Alert.alert('대표 사진을 설정해주세요.')
      return;
    }
    if (selectedStory.length < 3) {
      Alert.alert('최소 3개의 스토리를 선택해주세요.')
      return;
    }
    
    const response = await request.post('/curations/curation_create/', formData, { "Content-Type": "multipart/form-data" });
    console.log(response.data.data.id)
    console.log(formData)
    setCurationId(response.data.data.id);
    setModalVisible(true);
    }
  }

  const handleRepPic = () => {
    Alert.alert('대표 사진 선택', '', [
      {
        text: '카메라',
        onPress: () => { launchCamera({ mediaType: 'photo', maxHeight: height / 2, maxWidth: width }, response => response.didCancel != true && (response && response.assets) && setRep_pic(response.assets)) }
      },
      {
        text: '앨범',
        onPress: () => { launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, maxHeight: height / 2, maxWidth: width }, response => response.didCancel != true && (response && response.assets) && setRep_pic(response.assets)) }
      },
      {
        text: '취소',
        style: 'destructive'
      }
    ])
  }

  useEffect(() => {
    console.log(selectedStory);
  }, [selectedStory])
  
  useFocusEffect(useCallback(() => {
    if(id){
      console.log('id', id)
      
    getCurationDetail();
    getCurationStoryDetail();}
    console.log(selectedStory)
  }, [id]))

  useEffect(() => {
    if (curationDetail.title || curationDetail.contents  ) {
      setForm((prevForm) => ({
        ...prevForm,
        title: curationDetail.title || prevForm.title,
        contents: curationDetail.contents || prevForm.contents,
        
      }));
    }
  }, [curationDetail.title, curationDetail.contents]);
  
  
  
  
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e: any) => {
        if (!hasUnsavedChanges || curationId) {
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          '나가시겠습니까?',
          '입력하신 정보는 저장되지 않습니다.',
          [
            { text: "머무르기", style: 'cancel', onPress: () => {} },
            {
              text: '나가기',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges, curationId]
  );
      
  return (
    <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={iOS ? 0 : statusBarHeight+88} style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Modal visible={modalVisible}>
        <FinishModal
          navigation={()=>navigation.replace('Detail', {id: curationId})}
          setModal={setModalVisible}
          title={ id?'수정 완료 !':'작성 완료 !'}
          subtitle={[(id? '수정한 큐레이션은':'작성한 큐레이션은'), '마이페이지 > 큐레이션 > 내가 쓴 큐레이션', '에서 확인할 수 있어요']}
        />
      </Modal>
    <FormHeader  title= {id? '큐레이션 수정':'큐레이션 작성'} onLeft={() => id ? navigation.replace('Detail', { id: id}) : navigation.goBack()} onRight={uploadCuration} begin={true} end={true} />
    <ScrollView>
      <ReppicBox onPress={handleRepPic}>
        <ImageBackground source={( rep_pic[0].uri != '' ? ({uri: rep_pic[0].uri} ): (curationDetail?.rep_pic != ''? (  {uri:curationDetail.rep_pic}):require('../../assets/img/Home/form_example.png')))}
          imageStyle={{height: (height*0.9)/2}} style={{ flex: 1 }} resizeMode={'cover'} alt='대표 사진' />
        <View style={{backgroundColor: 'rgba(0,0,0,0.3)', width: width, height: (height*0.9)/2}}>
        <InputTitle value={form.title } placeholder='제목을 입력해주세요 *' placeholderTextColor={'white'} onChangeText={(e) => { setForm({ ...form, title: e }) }} maxLength={45} />
        <Text style={{ position: 'absolute', bottom: 25, right: 10 }}>{form.title.length||curationDetail.title.length}/45</Text>
        </View>
      </ReppicBox>
      <Section>
        <Text style={TextStyles.List}>선택된 스토리</Text>
        <StorySection>
          {
            selectedStory.map((data, index) =>
              <TouchableOpacity onPress={() => {  handleCheckedList(id? data.story_id: data.id) }} style={{ position: 'relative' }}>
                <StoryImage style={index == 0 && { borderColor: '#67D393', borderWidth: 2 }} source={{ uri: data.rep_pic }} />
                {index == 0 && <Text style={TextStyles.rep}>대표</Text>}
                <Text style={TextStyles.place_name}>{data.place_name}</Text>
              </TouchableOpacity>
            )
          }
          <Button onPress={() => [setSelectStoryModal(true)]}>
            <AddColor width={36} height={36} color={'#595959'} />
          </Button>
        </StorySection>
        <View style={{ position: 'relative' }}>
          <InputContent value = {form.contents} multiline={true} textAlignVertical='top' placeholder='큐레이션 설명을 작성해보세요.' onChangeText={(e) => { setForm({ ...form, contents: e }) }} maxLength={200} />
          <Text style={{ position: 'absolute', bottom: 30, right: 15 }}>{form.contents.length || curationDetail.contents.length}/200</Text>
        </View>
        <Footer>
          <TouchableOpacity onPress={navigation.goBack}><Text>취소</Text></TouchableOpacity>
          <TouchableOpacity onPress={uploadCuration}><Text>저장</Text></TouchableOpacity>
        </Footer>
      </Section>
      <Modal visible={selectStoryModal}>
        <SelectStoryModal setSelectStoryModal={setSelectStoryModal} setSelectedStory={setSelectedStory} selectedStory={selectedStory} />
      </Modal>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const TextStyles = StyleSheet.create({
  List: {
    fontSize: 16,
    fontWeight: '600',
  },
  rep: {
    position: 'absolute',
    right: 0,
    color: '#FFFFFF',
    fontSize: 12,
    backgroundColor: '#67D393',
    paddingHorizontal: 5,
    paddingVertical: 2,
    textAlign: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    fontWeight: '500'
  },
  place_name: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6,
    alignSelf: 'center'
  }
})
