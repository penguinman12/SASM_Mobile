import React, { useEffect, useState, useCallback } from "react";
import { Text, TouchableOpacity, View, Linking, LinkingStatic, Alert } from "react-native";
import { LinkingOptions, NavigationContainer, useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "./src/pages/SpotMap";
import LoginScreen from "./src/components/Auth/Login";
import MyPageScreen from "./src/pages/MyPage";
import ForestScreen from "./src/pages/Forest";
import StoryScreen, { StoryStackParams } from "./src/pages/Story";
import Navbar0 from "./src/assets/navbar/Navbar0.svg";
import Navbar1 from "./src/assets/navbar/Navbar1.svg";
import Navbar2 from "./src/assets/navbar/Navbar2.svg";
import Navbar3 from "./src/assets/navbar/Navbar3.svg";
import Navbar4 from "./src/assets/navbar/Navbar4.svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "./src/pages/Home";
import { Coord } from "react-native-nmap";
import SplashScreen from "react-native-splash-screen";
import { LoginProvider } from "./src/common/Context";
import CodePush from 'react-native-code-push';

export type AppProps = {
  Home: any;
  Login: any;
}

const Stack = createNativeStackNavigator();

const App = (): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 800);
  });

  const linking : LinkingOptions<AppProps> = {
    prefixes: ["kakao6f1497a97a65b5fe1ca5cf4769c318fd://"],
    config: {
      screens: {
        Home: {
          screens: {
            홈: '/:id',
            스토리: '/:id',
            맵: '/:id',
            포레스트: '/:id'
          }
        },
        Login: {}
      },
    },
  };

  // const handleOpenURL = ({ url }: any) => {
  //   const path = url.split('//')[1];
  //   Alert.alert(path)
  //   if (path.startsWith('kakao6f1497a97a65b5fe1ca5cf4769c318fd://')) {
  //     const uri = decodeURIComponent(path.slice(7));
  //     // navigation.navigate('작업 처리할 컴포넌트', { uri: uri ? uri : '' });
  //   }
  // };

  // Linking.addEventListener('url', handleOpenURL); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoginProvider>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={() => ({
              headerShown: false,
            })}
          >
            <Stack.Screen name="Home" component={HomeScreens} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoginProvider>
    </GestureHandlerRootView>
  );
};

export type TabProps = {
  홈: {
    id?: number | undefined;
  };
  맵: {
    id?: number;
    coor?: Coord;
    place_name?: string;
  };
  스토리: {
    id: number | undefined;
  };
  포레스트:{
    id: number | undefined;
  }
  /*add email parameter*/
  마이페이지: {
    email?: string; 
  }
};

const CustomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View
      style={{
        height: 88,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#FFFFFF",
        borderColor: "#E3E3E3",
        borderTopWidth: 1,
        paddingHorizontal: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index == index;
        const onPress = () => {
          if (route.name == "홈") {
            if (isFocused)
              navigation.reset({
                routes: [{ name: route.name, params: { id: undefined } }],
              });
            else navigation.navigate(route.name, { id: undefined });
          } else if (route.name == "맵") {
            if (isFocused)
              navigation.reset({
                routes: [
                  {
                    name: route.name,
                    params: { id: undefined, coor: undefined },
                  },
                ],
              });
            else
              navigation.navigate(route.name, {
                id: undefined,
                coor: undefined,
              });
          } else if (route.name == "스토리") {
            if (isFocused)
              navigation.reset({
                routes: [{ name: route.name, params: { id: undefined } }],
              });
            else navigation.navigate(route.name, { id: undefined });
          }
          else if (route.name == "포레스트") {
            if (isFocused)
              navigation.reset({
                routes: [{ name: route.name, params: { id: undefined } }],
              });
            else navigation.navigate(route.name, { id: undefined });
          }
          else {
            if (isFocused) navigation.reset({ routes: [{ name: route.name }] });
            else navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{
              width: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {
              {
                0: <Navbar0 color={isFocused ? "#67D393" : "#202020"} />,
                1: <Navbar1 color={isFocused ? "#67D393" : "#202020"} />,
                2: <Navbar2 color={isFocused ? "#67D393" : "#202020"} />,
                3: <Navbar3 color={isFocused ? "#67D393" : "#202020"} />,
                4: <Navbar4 color={isFocused ? "#67D393" : "#202020"} />,
              }[index]
            }

            <Text
              style={{
                color: isFocused ? "#67D393" : "#202020",
                marginVertical: 5,
                fontSize: 12,
              }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Tab = createBottomTabNavigator<TabProps>();
const HomeScreens = (): JSX.Element => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTab {...props} />}
      initialRouteName="홈"
      screenOptions={() => ({
        headerShown: false,
      })}
      backBehavior="order"
    >
      <Tab.Screen name={"홈"} component={HomeScreen} />
      <Tab.Screen name={"스토리"} component={StoryScreen} />
      <Tab.Screen name={"맵"} component={MapScreen} />
      <Tab.Screen name={"포레스트"} component={ForestScreen} />
      <Tab.Screen name={"마이페이지"} component={MyPageScreen} />
    </Tab.Navigator>
  );
};

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
  updateDialog: { 
    title: '업데이트하시겠습니까?', 
    optionalUpdateMessage: '소소한 버그를 수정했어요🐛', 
    optionalInstallButtonLabel: '업데이트', 
    optionalIgnoreButtonLabel: '아니요.',
    mandatoryUpdateMessage: '소소한 버그를 수정했어요🐛',
    mandatoryContinueButtonLabel: '업데이트'
  },
  installMode: CodePush.InstallMode.ON_NEXT_RESTART
}

export default CodePush(codePushOptions)(App);
