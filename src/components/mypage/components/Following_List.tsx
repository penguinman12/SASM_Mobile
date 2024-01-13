import React, { useState, useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, View, StyleSheet, SafeAreaView, Platform } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import { Request } from '../../../common/requests';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../pages/MyPage';
import SearchBar from '../../../common/SearchBar';
import Arrow from '../../../assets/img/common/Arrow.svg';
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TabProps } from "../../../../App";


const Following = ({ navigation, route }: StackScreenProps<MyPageProps, 'following'>) => {
  const request = new Request();
  const [followingList, setFollowingList] = useState<{ email: string, profile_image: string, nickname: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refresh, setRefresh] = useState<boolean>(false);

  const rerender = () => {
    setRefresh(!refresh);
  }

  const GetFollowing = async () => {
    const response = await request.get('/mypage/following/', {
      email: route.params.email,
      search_email: searchQuery
    });
    setFollowingList(response.data.data.results)
  }

  const undoFollowing = async (email: string) => {
    const response = await request.post('/mypage/follow/', { targetEmail: email });
    rerender();
  }

  useFocusEffect(
    useCallback(() => {
      GetFollowing();
    }, [searchQuery, refresh]))

  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: 10 }}>
      <TouchableOpacity style={{ left: 10, marginBottom: 18, display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS == 'ios' ? 5 : 0 }} onPress={() => { navigation.goBack() }}>
        <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} style={{ marginRight: 16 }} color={'black'}/>
        <Text style={{ fontSize: 16, lineHeight: 24, letteringSpace: -0.6 }} >팔로잉</Text>
      </TouchableOpacity>
      <SearchBar
        search={searchQuery}
        setSearch={setSearchQuery}
        style={{ width: '90%', backgroundColor: "#F4F4F4", }}
        placeholder='궁금한 프로필을 검색해보세요'
        keyboardType='email-address'
      />
      <ScrollView contentContainerStyle={styles.container}>
        {
          followingList.length == 0 ?
            <View>
              <Text style={styles.alert}>팔로잉 중인 유저가 없습니다</Text>
            </View> :
            <>
              {
                followingList.map((user) => (
                  <View key={user.email} style={styles.userContainer}>
                    <TouchableOpacity onPress={() => { navigationToTab.navigate('마이페이지', { email: user.email }) }}>
                      <Image source={{ uri: user.profile_image }} style={styles.profileImage} />
                    </TouchableOpacity>
                    <View style={styles.userInfo}>
                      <Text style={styles.username}>{user.nickname}</Text>
                      {/* <Text style={styles.useremail}>{user.email}</Text> */}
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', right: 20 }}
                      onPress={() => { undoFollowing(user.email) }}>
                        <Text style={styles.undofollowing}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                ))
              }
            </>
        }
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({

  text: {
    fontSize: 8,
    fontWeight: "bold"
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 6,
    bottom: 8,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  userContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  username: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.6
  },
  useremail: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6
  },
  searchStyle: {
    width: 390,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 10,
    fontSize: 12,

  },
  profileImage: {
    width: 50,
    height: 50,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    marginHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  undofollowing: {
    height: 18,
    fontSize: 10,
    lineHeight: 18,
    borderColor: '#D7D7D7',
    borderWidth:1,
    paddingHorizontal:7,
    borderRadius:9
  },
  alert: {
    fontWeight: '700',
    marginLeft: 20
  }
});



export default Following;
