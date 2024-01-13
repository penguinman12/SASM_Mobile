import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import MyPageTabView, { IUserInfo } from '../components/mypage/MyPageTabView';
import UserInfoBox from '../components/mypage/components/UserInfoBox';
import LoginScreen from '../components/Auth/Login';
import RegisterScreen from '../components/Auth/Register';
import ChangeForm from '../components/mypage/components/option/ChangeForm';
import PasswordChange from '../components/mypage/components/option/ChangePassword';
import Feedback from '../components/mypage/components/option/GetFeedback';
import FindIDPWScreen from '../components/Auth/FindIDPW';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import Following from '../components/mypage/components/Following_List';
import Follower from '../components/mypage/components/Follower_List';
import UserFollowing from '../components/mypage/components/User_Following_List';
import Options from '../components/mypage/components/option/OptionPage';
import Withdraw from '../components/mypage/components/option/Withdraw';
import UserPageTabView from '../components/mypage/UserPageTabView';
import { TabProps } from '../../App';

export type MyPageProps = {
    'mypage': any;
    'login': any;
    'register': any;
    'user': {
        info: IUserInfo;
        follower: number;
        following: number;
    }
    'change': {
        info: IUserInfo;
    };
    'changepw': any;
    'feedback': any;
    'findidpw': any;
    'following': {
        email: string;
    }
    'user_following': {
        email: string;
    }
    'follower': {
        email: string;
    }
    'options': any;
    'withdraw': any;
    /*파라미터 이메일 설정*/
    'userpage' : {
        email : string;
    }
}
const MyPageStack = createNativeStackNavigator<MyPageProps>();

const MyPageScreen = ({ navigation, route }: StackScreenProps<TabProps, '마이페이지'>) => { /*라우트 받아오기*/
    const navigationToMypage = useNavigation<StackNavigationProp<MyPageProps>>(); /*네비게이션 설정*/
    useEffect(() => {
    if(route.params?.email) {
        // navigationToStory.reset({routes: [{name: "StoryDetail", params: { id: route.params.id }}]});
        navigationToMypage.push('userpage', { email : route.params?.email}) /*넘어갈 페이지 설정*/
    }
    }, [route.params?.email])
    return (
        <MyPageStack.Navigator
            screenOptions={() => ({
                headerShown: false,
            })} >
            <MyPageStack.Screen name="mypage" component={MyPageTabView} />
            <MyPageStack.Screen name="user" component={UserInfoBox} />
            <MyPageStack.Screen name="login" component={LoginScreen} />
            <MyPageStack.Screen name="register" component={RegisterScreen} />
            <MyPageStack.Screen name='change' component={ChangeForm} />
            <MyPageStack.Screen name='changepw' component={PasswordChange} />
            <MyPageStack.Screen name='feedback' component={Feedback} />
            <MyPageStack.Screen name="findidpw" component={FindIDPWScreen} />
            <MyPageStack.Screen name="following" component={Following} />
            <MyPageStack.Screen name="follower" component={Follower} />
            <MyPageStack.Screen name="user_following" component={UserFollowing} />
            <MyPageStack.Screen name="options" component={Options} />
            <MyPageStack.Screen name="withdraw" component={Withdraw} />
            <MyPageStack.Screen name="userpage" component={UserPageTabView} />
        </MyPageStack.Navigator>
    )
}
export default MyPageScreen;