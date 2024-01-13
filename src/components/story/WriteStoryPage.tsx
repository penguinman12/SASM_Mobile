import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Modal, Dimensions, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Request } from '../../common/requests';
import FormHeader from '../../common/FormHeader';
import FinishModal from '../../common/FinishModal';
import ModalSelector from 'react-native-modal-selector-searchable';
import { StoryProps } from '../../pages/Story';
import { getStatusBarHeight } from 'react-native-safearea-height';

const { width, height } = Dimensions.get('window');

export default function WriteStoryPage({ navigation, route }: StoryProps) {
  const editor = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);
  const request = new Request();
  const post = route.params?.story;
  const [places, setPlaces] = useState([] as any);
  const [repPic, setRepPic] = useState([] as any);
  const [story, setStory] = useState({ title: "", tag: "", preview: ".", place: 0, story_review: "", html_content: "", photoList: [], rep_pic: "" });
  const [photoList, setPhotoList] = useState([] as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [storyId, setStoryId] = useState<number>(0);
  const statusBarHeight = getStatusBarHeight();
  const hasUnsavedChanges = Boolean(story.title.length > 0 || story.tag.length > 0 || story.preview.length > 0 || story.place != 0 || story.html_content.length > 0 || photoList.length > 0 || repPic.length > 0);

  const options: ImageLibraryOptions = {
    mediaType: "photo",
    maxWidth: 300,
  };

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const response_places = await request.get(`/sdp_admin/places/`, null, null);
    setPlaces(response_places.data.data);
    if (!post) return;
    else {
      let _place = 0;
      const { title, tag, story_review, html_content, rep_pic, place_name } = post;
      for (const place of response_places.data.data) {
        if (place_name === place.place_name){
          _place = place.id
        }
      }
      setStory({
        ...story,
        title: title, tag: tag, story_review: story_review, place: _place,
        html_content: html_content, rep_pic: rep_pic
      });
    }
  }

  const pickImage = () => {
    launchImageLibrary(options, (response: any) => {
      if (response && response.assets) uploadImage(response.assets[0]);
    });
  }

  const handleRepPic = () => {
    Alert.alert('대표 사진 선택', '', [
      {
        text: '카메라',
        onPress: () => { launchCamera({ mediaType: 'photo', maxHeight: height / 2, maxWidth: width }, response => {
          if (response && response.assets) setRepPic(response.assets)})
        }
      },
      {
        text: '앨범',
        onPress: () => { launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, maxHeight: height / 2, maxWidth: width }, response => {
          if (response && response.assets) setRepPic(response.assets)})
        }
      }
    ])
  }

  const uploadImage = async (image: any) => {
    const formData = new FormData();
    for (const place of places) {
      if (story.place === place.id) {
        formData.append('place_id', place.id);
        formData.append('caption', place.place_name);
        break;
      }
    }
    formData.append('image', {
      uri: image.uri,
      name: image.fileName,
      type: image.uri.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
    });
    const response = await request.post("/stories/story_photos/create/", formData, { "Content-Type": "multipart/form-data" });
    editor.current?.insertImage(response.data.data.location, 'width: 100%; height: auto;');
    setPhotoList([...photoList, response.data.data.location]);
  };

  const saveStory = async () => {
    if(story.place == 0){
      Alert.alert('장소를 설정해주세요.');
      return;
    }
    if(story.title.length == 0 || story.tag.length == 0 || story.tag.length == 0 || story.html_content.length == 0){
      Alert.alert('빈 칸을 전부 채워주세요.');
      return;
    }
    if(repPic.length == 0){
      Alert.alert('대표 사진을 설정해주세요.');
      return;
    }
    const formData = new FormData();
    for (const photo of photoList){
      formData.append('photoList', photo);
    }
    for (let [key, value] of Object.entries(story)) {
      if (key === "rep_pic") {
        formData.append(`${key}`, {
          uri: repPic[0].uri,
          name: repPic[0].fileName,
          type: repPic[0].uri.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
        });
      } else {
        //문자열의 경우 변환
        formData.append(`${key}`, `${value}`);
      }
    }
    const response = await request.post("/stories/create/", formData, { "Content-Type": "multipart/form-data" });
    setStoryId(response.data.data.id);
    setModalVisible(true);
  };

  const updateStory = async () => {
    if(story.place == 0){
      Alert.alert('장소를 설정해주세요.');
      return;
    }
    if(story.title.length == 0 || story.tag.length == 0 || story.tag.length == 0 || story.html_content.length == 0){
      Alert.alert('빈 칸을 전부 채워주세요.');
      return;
    }
    const formData = new FormData();
    for (const photo of photoList){
      formData.append('photoList', photo);
    }
    for (let [key, value] of Object.entries(story)) {
      if (key === "rep_pic") {
        if(repPic.length > 0){
          formData.append(`${key}`, {
            uri: repPic[0].uri,
            name: repPic[0].fileName,
            type: repPic[0].uri.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
          });
        }
      } else {
        //문자열의 경우 변환
        formData.append(`${key}`, `${value}`);
      }
    }
    const response = await request.put(`/stories/${post.id}/update/`, formData, { "Content-Type": "multipart/form-data" });
    setStoryId(post.id);
    setModalVisible(true);
  }

  const handleCursorPosition = useCallback((scrollY: number) => {
    // Positioning scroll bar
    scrollRef.current!.scrollTo({y: scrollY - 30, animated: true});
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e: any) => {
        if (!hasUnsavedChanges || storyId != 0) {
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
    [navigation, hasUnsavedChanges, storyId]
  );
  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Modal visible={modalVisible}>
        <FinishModal
          navigation={()=>navigation.replace('StoryDetail', {id: storyId})}
          setModal={setModalVisible}
          title={ post ? '수정 완료 !' : '작성 완료 !'}
          subtitle={['작성한 스토리는', '마이페이지 > 스토리 > 내가 쓴 스토리', '에서 확인할 수 있어요']}
        />
      </Modal>
      <FormHeader title='스토리 작성' onLeft={() => {post ? navigation.replace('StoryDetail', {id: post.id}) : navigation.goBack()}} onRight={post ? updateStory : saveStory} begin={true} end={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        editor.current?.dismissKeyboard();
      }}>
      <>
        <TextInput
          value={story.title}
          onChangeText={(title) => { setStory({ ...story, title: title }) }}
          placeholder='제목 *'
          placeholderTextColor={'#bcbcbe'}
          style={{borderBottomColor: '#D9D9D9', borderBottomWidth: 1, padding: 10, height: 40}}
        />
        <TextInput
          value={story.story_review}
          onChangeText={(story_review) => { setStory({ ...story, story_review: story_review }) }}
          placeholder='한 줄 소개 *'
          placeholderTextColor={'#bcbcbe'}
          style={{padding: 10, height: 40}}
        />
        <ModalSelector
          data={places}
          selectedKey={post ? story.place : 0}
          keyExtractor={item => item.id}
          labelExtractor={item => item.place_name}
          onChange={(option) => { setStory({ ...story, place: option.id }) }}
          search={true}
          searchText='장소 검색'
          initValue='장소 선택 *'
          initValueTextStyle={{textAlign: 'left', fontSize: 14, color: '#bcbcbe'}}
          optionStyle={{height: 40}}
          selectStyle={{borderRadius: 0, borderTopColor: '#D9D9D9', borderBottomColor: '#D9D9D9', borderLeftWidth:0, borderRightWidth:0, borderBottomWidth: 1, alignItems: 'flex-start', padding: 10, height: 40}}
          selectTextStyle={{fontSize: 14, color: 'black'}}
          optionContainerStyle={{height: height-statusBarHeight}}
          cancelText='취소'
          renderItem={() => {return null}}
        />
          </>
        </TouchableWithoutFeedback>
        {
          story.place != 0 &&
          <>
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            editor.current?.dismissKeyboard();
          }}>
          <>
            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 10, color: (story.rep_pic == '' && repPic.length === 0) ? '#bcbcbe' : 'black'}}>대표 사진 *</Text>
              <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}} onPress={handleRepPic}>
                { story.rep_pic == '' && repPic.length == 0 ? (
                  <Text style={{color: '#bcbcbe'}}>업로드</Text>
                ) : (
                  <Image source={{uri: repPic.length > 0 ? repPic[0].uri : story.rep_pic}} style={{width: 30, height: 30}} />
                )}
              </TouchableOpacity>
            </View>
            {/* <TextInput
              value={story.preview}
              onChangeText={(preview) => { setStory({ ...story, preview: preview }) }}
              placeholder='프리뷰 *'
              placeholderTextColor={'#bcbcbe'}
              style={{padding: 10, borderTopColor: '#D9D9D9', borderBottomColor: '#D9D9D9', borderTopWidth: 1, borderBottomWidth: 1, height: 40}}
            /> */}
            <TextInput
              value={story.tag}
              onChangeText={(tag) => { setStory({ ...story, tag: tag }) }}
              placeholder='#해시태그를 #작성해주세요 *'
              placeholderTextColor={'#bcbcbe'}
              style={{padding: 10, borderTopColor: '#D9D9D9', borderTopWidth: 1, borderBottomColor: '#D9D9D9', borderBottomWidth: 1, height: 40}}
            />
                </>
          </TouchableWithoutFeedback>
            <RichToolbar
              editor={editor}
              actions={[
                actions.insertImage,
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.setUnderline,
              ]}
              onPressAddImage={pickImage}
            />
            <ScrollView ref={scrollRef} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              <RichEditor
                ref={editor} // from useRef()
                initialContentHTML={story.html_content}
                onChange={(html_content) => { setStory({ ...story, html_content: html_content }) }}
                placeholder="내용"
                initialHeight={450}
                useContainer={true}
                onCursorPosition={handleCursorPosition}
              />
            </ScrollView>
          </>
        }
      </ScrollView>
    </View>
  )
}