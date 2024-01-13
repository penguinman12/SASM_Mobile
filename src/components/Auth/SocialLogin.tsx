import React, { useContext, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import Kakao from "../../assets/img/Auth/Social_Kakao.svg";
import Naver from "../../assets/img/Auth/Social_Naver.svg";
import Google from "../../assets/img/Auth/Social_Google.svg";
import Apple from "../../assets/img/Auth/Social_Apple.svg";
import styled from 'styled-components/native';
// Social login
// kakao
import * as KakaoLogin from '@react-native-seoul/kakao-login';
// naver
import NaverLogin from '@react-native-seoul/naver-login';
// google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// apple
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GOOGLE_WEB_CLIENT_ID, NAVER_APP_CLIENT_ID, NAVER_APP_CLIENT_SECRET, NAVER_APP_SERVICE_URL_SCHEME } from 'react-native-dotenv';
import { setNickname, setAccessToken, setRefreshToken } from '../../common/storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageProps } from '../../pages/MyPage';
import { Request } from '../../common/requests';
import { LoginContext } from '../../common/Context';
import { RegisterParams } from './Register';
const { width, height } = Dimensions.get('window');

const Button = styled.TouchableOpacity`
  width: ${width * 0.85};
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  position: relative;
  margin-vertical: 8px;
`
const request = new Request();

export const processLoginResponse = (response: any, navigation: any, setLogin: (value: boolean) => void) => {
  // const navigation = useNavigation<StackNavigationProp<MyPageProps>>();
  if (response.status == 200) {
    const nickname = response.data.data.nickname
    const accessToken = response.data.data.access
    const refreshToken = response.data.data.refresh
    setNickname(nickname)
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
    setLogin(true);
    navigation.navigate('mypage');
  } else if (response.status == 400) {
    Alert.alert(response.data.extra.fields !== undefined ? response.data.extra.fields.detail : response.data.message)
  }
  else {
    Alert.alert('예상치 못한 오류가 발생하였습니다.')
  }
}



export default function SocialLogin({ type }: { type: string }) {
  const navigation = useNavigation<StackNavigationProp<MyPageProps>>();
  const navigationRegister = useNavigation<StackNavigationProp<RegisterParams>>();
  const { isLogin, setLogin } = useContext(LoginContext);
  const google_configure = () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  };

  const kakao_login = () => {
    KakaoLogin.login().then((result) => {
      console.log("카카오 로그인 성공", JSON.stringify(result));
      return request.get('/users/kakao/callback/', {
        access_token: result.accessToken,
      });
    }).then((response) => {
      processLoginResponse(response, navigation, setLogin);
    }).catch((error) => {
      console.error(error)
      Alert.alert('카카오 로그인이 실패하였습니다.')
    });
  };

  const naver_login = async () => {
    NaverLogin.login({
      appName: 'SASM',
      consumerKey: NAVER_APP_CLIENT_ID,
      consumerSecret: NAVER_APP_CLIENT_SECRET,
      serviceUrlScheme: NAVER_APP_SERVICE_URL_SCHEME,
    }).then(({ isSuccess, successResponse }) => {
      if (isSuccess) {
        console.log("네이버 로그인 성공", successResponse?.accessToken);
        return request.get('/users/naver/callback/', {
          access_token: successResponse?.accessToken,
        });
      }
      else {
        throw new Error("undefined error");
      }
    }).then((response) => {
      processLoginResponse(response, navigation, setLogin);
    }).catch((error) => {
      console.error(error)
      Alert.alert('네이버 로그인이 실패하였습니다.');
    });
  };

  const google_login = () => {
    GoogleSignin.signIn().then(({ idToken }) => {
      console.log("구글 로그인 성공", idToken);
      GoogleSignin.getTokens().then((res) => {
        console.log("access token!!", res.accessToken);
        return request.get('/users/google/callback/', {
          access_token: res.accessToken,
        });
      }).then((response) => {
        processLoginResponse(response, navigation, setLogin);
      });
    }).catch((error) => {
      console.error(error)
      Alert.alert('구글 로그인이 실패하였습니다.')
    });
  }


  const apple_login = async () => {
    appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    }).then(async (appleAuthRequestResponse) => {
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error("인증 상태가 아닌 유저입니다.")
      }
      return request.get('/users/apple/callback/', {
        token: appleAuthRequestResponse.identityToken,
      });
    }).then((response) => {
      processLoginResponse(response, navigation, setLogin);
    }).catch((error) => {
      console.error(error)
      Alert.alert('애플 로그인이 실패하였습니다.')
    });
  }

  useEffect(() => {
    google_configure();
  }, [])

  return (
    <View>
      <Button style={{ borderColor: '#000000', borderWidth: 1 }} onPress={() => google_login()}>
        <Google width={15} height={16} style={{ position: 'absolute', top: 16, left: 16 }} />
        <Text style={TextStyles.button}>구글로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </Button>
      <Button style={{ backgroundColor: '#03C75A' }} onPress={() => naver_login()}>
        <Naver width={16} height={16} style={{ position: 'absolute', top: 16, left: 16 }} />
        <Text style={{ ...TextStyles.button, color: '#FFFFFF' }}>네이버로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </Button>
      <Button style={{ backgroundColor: '#FEE500' }} onPress={() => kakao_login()}>
        <Kakao width={18} height={16} style={{ position: 'absolute', top: 16, left: 16 }} />
        <Text style={TextStyles.button}>카카오로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </Button>
      {Platform.OS == 'ios' && <Button style={{ backgroundColor: '#000000' }} onPress={() => apple_login()}>
        <Apple width={30} height={30} style={{ position: 'absolute', left: 10 }} />
        <Text style={{ ...TextStyles.button, color: '#FFFFFF' }}>Apple로 {{
          'register': '회원가입',
          'login': '로그인'
        }[type]}</Text>
      </Button>}
      {
        (type == 'register') &&
        <Button style={{ borderColor: '#67D393', borderWidth: 1 }} onPress={() => navigationRegister.navigate('email')}>
          <Text style={TextStyles.button}>이메일로 회원가입</Text>
        </Button>
      }
    </View>
  )
}

const TextStyles = StyleSheet.create({
  button: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.6,
    fontWeight: '700',
    alignSelf: 'center'
  }
})