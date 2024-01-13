import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, Image, View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import Arrow from '../../../../assets/img/common/Arrow.svg';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../../pages/MyPage';
import styled from 'styled-components/native';
import InputWithLabel from '../../../../common/InputWithLabel';
import DatePicker from '../../../../common/DatePicker';
import { useFocusEffect } from '@react-navigation/native';
import ProfileImage from '../../../../assets/img/MyPage/ProfileImage.svg';
import { Request } from '../../../../common/requests';
import { CameraSelector } from '../../../../common/PhotoOptions';
import * as ImagePicker from "react-native-image-picker";
import NextButton from '../../../../common/NextButton';

const Section = styled.View`
  margin-vertical: 20px;
`
const GenderSelector = styled.View`
  display: flex;
  width: 85%;
  align-items: center;
  justify-content: space-around;
  flex-Direction: row;
  margin: 0 auto;
  margin-bottom: 18px;
`
const ImageSelector = styled.View`
  width: 80px;
  height: 80px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 30px;
`
const GenderText = styled.Text<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#67D393' : '#F4F4F4'}
  color: ${props => props.selected ? '#FFFFFF' : '#000000'}
  padding: 10px 15px;
  overflow: hidden;
  border-radius: 20px;
`
const CheckButton = styled.TouchableOpacity`
  position: absolute;
  top: 25px;
  right: 35px;
  border: 1px #67D393 solid;
  padding: 5px;
  borderRadius: 10px;
`
interface InfoFormProps {
  gender: string;
  birthdate: string;
  introduction: string;
  nickname: string;
  profile_image?: ImagePicker.Asset;
  [key: string]: string | ImagePicker.Asset | undefined;
}

export default function ChangeForm({ navigation, route }: StackScreenProps<MyPageProps, 'change'>) {
  const request = new Request();
  const [loading, setLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [form, setForm] = useState<InfoFormProps>({
    gender: '',
    nickname: '',
    birthdate: '',
    introduction: '',
  })

  let profile_src;
  if (form.profile_image) {
    profile_src = form.profile_image.uri;
  }
  else {
    profile_src = route.params.info.profile_image;
  }

  useFocusEffect(useCallback(() => {
    setForm({
      gender: route.params.info.gender,
      nickname: route.params.info.nickname,
      birthdate: route.params.info.birthdate,
      introduction: route.params.info.introduction
    })
    setLoading(false);
  }, []))

  const checkRepetition = async () => {
    const response_check = await request.post('/users/rep_check/', {
      type: 'nickname',
      value: form.nickname,
    })
    console.log(response_check)
    if (response_check.data.data.includes("가능")) {
      setCheck(true);
    }
    else {
      setAlert(true);
      setTimeout(()=>{setAlert(false)}, 3000);
    }
    Alert.alert(response_check.data.data)
  }

  const genderOption = [
    {
      name: '남자', option: 'male'
    },
    {
      name: '여자', option: 'female'
    },
    {
      name: '선택 안함', option: 'other'
    }
  ]

  const updateInfo = async () => {
    const formData = new FormData()
    for (let key of Object.keys(form)) {
      if (form[key] != route.params.info[key]) {
        if (key == 'profile_image' && form.profile_image) {
          formData.append(key,  {
            uri: form.profile_image.uri,
            name: form.profile_image.fileName,
            type: form.profile_image.uri!.endsWith('.jpg') ? 'image/jpeg' : 'image/png'
          })
        }
        else if(key == 'nickname') {
          if(!check) {
            Alert.alert('닉네임 중복체크를 해주세요');
            return;
          }
          else formData.append(key, form[key]);
        }
        else {
          console.log(key)
          formData.append(key, form[key])
        }
      }
    }
    if(formData.getParts().length==0) return;
    const response = await request.patch('/mypage/me/update/', formData, {"Content-Type": "multipart/form-data"});
    if (response.data.status == 'success') {
      navigation.navigate('mypage');
    }
    else {
      Alert.alert(response.data.message)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'height' : undefined} keyboardVerticalOffset={0} style={{flex: 1}}>
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1, paddingTop: 10 }}>
      <View style={{ position: 'relative', marginTop: Platform.OS == 'ios' ? 5 : 0 }}>
        <Text style={TextStyles.header}>프로필 수정</Text>
        <TouchableOpacity style={{ left: 10, top: 5, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.goBack() }}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} color={'black'} />
        </TouchableOpacity>
      </View>
      {
        loading ?
          <ActivityIndicator style={{flex:1}}/> :
          <Section>
            <ImageSelector>
              <Image source={{ uri: profile_src }} style={{ width: 80, height: 80, borderRadius: 40 }} />
              <TouchableOpacity onPress={() => {
                CameraSelector((res) => { setForm({ ...form, profile_image: res[0] }) }, 1)
              }} style={{ position: 'absolute', right: 5, bottom: 5 }}>
                <ProfileImage width={16} height={16} />
              </TouchableOpacity>
            </ImageSelector>
            <InputWithLabel
              value={form.nickname}
              label='닉네임'
              alertLabel='이미 사용중인 닉네임입니다'
              isAlert={alert}
              descriptionLabel={check ? '사용 가능한 닉네임입니다' : ''}
              placeholder='닉네임을 입력해주세요'
              onChangeText={(e) => { setCheck(false); setForm({ ...form, nickname: e }) }}
              onBlur={() => { }}>
              <CheckButton onPress={checkRepetition}><Text>중복 체크</Text></CheckButton>
            </InputWithLabel>
            <InputWithLabel
              value={form.introduction}
              label='자기소개'
              placeholder='자기소개를 입력해주세요'
              onChangeText={(e) => { setForm({ ...form, introduction: e }) }}
            />
            <Text style={{ width: '85%', textAlign: 'left', fontSize: 14, lineHeight: 18, letterSpacing: -0.6, alignSelf: 'center' }}>
              성별
            </Text>
            <GenderSelector>
              {genderOption.map(data => (
                <TouchableOpacity key={data.name} onPress={() => { setForm({ ...form, gender: data.option }) }}>
                  <GenderText selected={form.gender == data.option}>
                    {data.name}
                  </GenderText>
                </TouchableOpacity>
              ))}
            </GenderSelector>
            {/* <Text style={{ width: '85%', textAlign: 'left', fontSize: 14, lineHeight: 18, letterSpacing: -0.6, alignSelf: 'center' }}>
              생년월일
            </Text>
            <DatePicker
              callback={(e) => {
                console.log(e);
                let date = ''
                if (e.month < 10) date = `${e.year}-0${e.month}-${e.date}`
                else if (e.date < 10) date = `${e.year}-0${e.month}-0${e.date}`
                else if (e.date < 10 && e.month < 10) date = `${e.year}-0${e.month}-0${e.date}`
                else date = `${e.year}-${e.month}-${e.date}`
                setForm({ ...form, birthdate: date })
              }}
              containerStyle={{ zIndex: 2 }}
              defaultDate={form.birthdate}
            /> */}
            <NextButton onPress={updateInfo} label='저장' style={{alignSelf: 'center'}} />
          </Section>
      }
    </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const TextStyles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  submit: {
    marginTop: 100,
    width: 175,
    height: 45,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#67D393',
    overflow: 'hidden',
    color: '#F4F4F4',
    fontSize: 16,
    lineHeight: 45,
    letterSpacing: -0.6,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 0
  }
})