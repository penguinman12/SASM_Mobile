import { useState, useEffect, useCallback, useContext } from 'react';
import { View, SafeAreaView, useWindowDimensions, Image, Alert, Platform } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Request } from '../../common/requests';
import UserPlace from './components/myplace/UserPlace';
import UserStory from './components/mystory/UserStory';
import UserCuration from './components/mycuration/UserCuration';
import UserForest from './components/myforest/UserForest';
import { MyPageProps } from '../../pages/MyPage';
import Profile from '../../assets/img/MyPage/Profile.svg';
import Settings from '../../assets/img/MyPage/Settings.svg';
import { getAccessToken } from '../../common/storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginContext } from '../../common/Context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ForestStackParams } from '../../pages/Forest';
import { TabProps } from '../../../App';

export interface IUserInfo {
  id: number;
  gender: string;
  nickname: string;
  birthdate: string;
  email: string;
  profile_image: string;
  address: string;
  is_sdp_admin: boolean;
  is_verifed: boolean;
  introduction: string;
  [key: string]: string | boolean | number;
}

export interface OtherUserInfo {
  email : string;
}

/*연결해주는 타입 설정*/
const UserPageTabView = ({ navigation, route}: StackScreenProps<MyPageProps, 'userpage'>) => {
  const [otherEmail, setOtherEmail] = useState(route.params.email)
  const { isLogin, setLogin } = useContext(LoginContext);
  const [info, setInfo] = useState<IUserInfo>({
    id: 0,
    gender: '',
    nickname: '',
    birthdate: '',
    email: '',
    profile_image: '',
    address: '',
    is_sdp_admin: false,
    is_verifed: false,
    introduction: ''
  });
  const [follower, setFollower] = useState<{ num: number, list: any[] }>({ num: 0, list: [] });
  const [following, setFollowing] = useState<{ num: number, list: any[] }>({ num: 0, list: [] });

  const getUserinfo = async () => {
    const response_info = await request.get(`/mypage/user/`, {
      email: otherEmail, 
    }); 
    setInfo(response_info.data.data) 

    const response_following = await request.get('/mypage/following/', {
      email: response_info.data.data.email,
      search_email: '',
    })
    const response_follower = await request.get('/mypage/follower/', {
      email: response_info.data.data.email,
      search_email: '',
    })

    setFollower({ num: response_follower.data.data.count, list: response_follower.data.data.results })
    setFollowing({ num: response_following.data.data.count, list: response_following.data.data.results })

  }

  const layout = useWindowDimensions();
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: "place", title: "장소" },
    { key: "story", title: "스토리" },
    { key: "curation", title: "큐레이션" },
    { key: "forest", title: "포레스트" }
  ]);
  const request = new Request();

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "place":
        return <UserPlace email={otherEmail}/>;
      case "story":
        return <UserStory email={otherEmail}/>;
      case "curation":
        return <UserCuration email={otherEmail}/>;
      case "forest":
        return <UserForest email={otherEmail}/>
    }
  }


  useFocusEffect(useCallback(() => {
    if (isLogin) getUserinfo();
  }, [isLogin]))

  const ProfileSection = () => {
    return (
      <View style={{ flexDirection: "row", marginLeft: 15 }}>
        {
          isLogin ?
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: info?.profile_image }} style={{ width: 80, height: 80, borderRadius: 60 }} />
              <View style={{ paddingVertical: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>{info?.nickname}</Text>
                <Text style={{ fontWeight: "400", fontSize: 12, marginTop: 10 }}>{info?.introduction.length > 0 ? info?.introduction : `자기소개`}</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => { navigation.navigate('follower', { email: info.email }) }}>
                    <Text style={{ fontWeight: "400", fontSize: 12, color: "#848484", marginTop: 10 }}>팔로워 {follower.num}  |  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { navigation.navigate('user_following', { email: info.email }) }}>
                    <Text style={{ fontWeight: "400", fontSize: 12, color: "#848484", marginTop: 10 }}>팔로잉 {following.num}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            :
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 80, height: 80, borderRadius: 60, borderColor: '#4DB1F7', borderWidth: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Profile />
              </View>
              <View style={{ paddingVertical: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>SASM</Text>
                <Text style={{ fontWeight: "400", fontSize: 12, marginTop: 10 }}>로그인해서 다른 사람들의 장소를 탐색해보세요</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity>
                    <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로워 0 |  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로잉 0</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        }
      </View>
    )
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1}}>
      {/* <View style={{ flexDirection: "row", paddingHorizontal: 15, paddingVertical: 10, justifyContent:'space-between' }}>
        <TouchableOpacity style={{width: 30, alignItems: 'center', justifyContent: 'center', height: 30}}
          onPress={() => { {isLogin ? navigation.navigate('user', { info: info, follower: follower.num, following: following.num }) : Alert.alert('로그인이 필요합니다')} }}>
          <Profile />
        </TouchableOpacity>
        <TouchableOpacity style={{width: 30, alignItems: 'center', justifyContent: 'center', height: 30}} 
          onPress={() => { isLogin ? navigation.navigate('options', { info: info }) : Alert.alert('로그인이 필요합니다') }}>
          <Settings color={'black'} />
        </TouchableOpacity>
      </View> */}
       <TouchableOpacity style={{width: 30, alignItems: 'center', justifyContent: 'center', height: 30, alignSelf: 'flex-end', marginRight: 10, marginTop: 5}} 
          onPress={() => { isLogin ? navigation.navigate('options', { info: info }) : Alert.alert('로그인이 필요합니다') }}>
          <Settings color={'black'} />
        </TouchableOpacity>
      <ProfileSection />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorContainerStyle={{
              borderBottomColor: "#848484",
              borderBottomWidth: 0.25
            }}
            indicatorStyle={{
              backgroundColor: "#67D393",
            }}
            style={{
              backgroundColor: "white",
              shadowOffset: { height: 0, width: 0 },
              shadowColor: "transparent",
            }}
            labelStyle={{
              color: '#202020'
            }}
            pressColor={"transparent"}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default UserPageTabView;