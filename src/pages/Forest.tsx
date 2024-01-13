import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoardListScreen from '../components/Forest/BoardList';
import BoardDetailScreen from '../components/Forest/BoardDetail';
import PostListScreen from '../components/Forest/PostList';
import PostSearchScreen from '../components/Forest/PostSearch';
import PostDetailScreen from '../components/Forest/PostDetail';
import PostCommentsScreen from '../components/Forest/PostComments';
import PhotoPreviewScreen from '../common/PhotoPreview';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { TabProps } from '../../App';
import PostUploadScreen from '../components/Forest/PostUpload';
import { SelectedCategoryProvider } from '../components/Forest/SelectedCategoryContext';

export interface BoardFormat {
  name: string;
  supportsHashtags: boolean;
  supportsPostPhotos: boolean;
  supportsPostComments: boolean;
  supportsPostCommentPhotos: boolean;
  postContentStyle: string;
}

export type ForestStackParams = {
  BoardList: any;
  BoardDetail: {
    board_category: any;
    user_select: any;
    user_select_id: number[];
  }
  PostList: {
    board_name?: string;
    board_category?: any;
    category_Ids?:any;
  };
  PostSearch: any;
  PostDetail: {
    post_id: number;
  };
  PostComments: {
    id: number;
    email: string;
  }
  PostUpload: {
    post?: any;
  }
  PhotoPreview: {
    photoUri: any;
  }
};

const Stack = createNativeStackNavigator<ForestStackParams>();

const Forest = ({navigation, route}:StackScreenProps<TabProps, '포레스트'>) => {
  const navigationToForest = useNavigation<StackNavigationProp<ForestStackParams>>();
  useEffect(()=>{
    if(route.params?.id) {
      // navigationToForest.reset({routes: [{name: "PostDetail", params: { post_id:route.params.id }}]});
      navigationToForest.push('PostDetail', {post_id: route.params.id})
    }
  },[route.params?.id])
  return (
    <SelectedCategoryProvider>
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="BoardList" component={BoardListScreen} />
      <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
      <Stack.Screen name="PostList" component={PostListScreen} />
      <Stack.Screen name="PostSearch" component={PostSearchScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostComments" component={PostCommentsScreen} />
      <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
      <Stack.Screen name="PostUpload" component={PostUploadScreen} />
    </Stack.Navigator>
    </SelectedCategoryProvider>
  );
};


export default Forest;