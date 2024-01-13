import React, { useCallback } from 'react';
import { Share, Alert, TouchableOpacity } from 'react-native';
import ShareIcon from '../assets/img/common/Share.svg';
import KakaoShareLink from "react-native-kakao-share-link";

interface ShareButtonProps {
  message: string;
  image: string;
  description: string;
  color: 'black' | 'white';
  id: Number;
}

// TODO: 카카오톡 공유하기 등 기능 확장 필요
export default function ShareButton({ message, color, image, description, id }: ShareButtonProps): JSX.Element {
  const getPreview = (description: string) => {
    return description
			.replace(/\s{2,}/g, ' ') // space 두개인 경우 하나로 치환
			.replace(/<.*?>/g, ' ') // 그외 html 태그 치환
			.substring(0, 100) // 50자만 잘라서 반환
  }

  const onShare = useCallback(async () => {
		try {
			const response = await KakaoShareLink.sendFeed({
				content: {
					title: message,
					imageUrl: image,
          description: getPreview(description),
          link: {
            webUrl: "https://www.sasm.co.kr/",
            mobileWebUrl: "https://www.sasm.co.kr/",
          },
        },
        buttons: [
					{
						title: "SASM 앱에서 확인해보세요!",
						link: {
							androidExecutionParams: [
								{ key: 'id', value: id.toString() }
							],
							iosExecutionParams: [
								{ key: 'id', value: id.toString() }
							]
						},
					},
				],
      });
    } catch (e: any) {
      console.error(e);
      Alert.alert('공유하기가 실패하였습니다.')
    }
  }, [message, id, image, description]);

  return (
    <TouchableOpacity style={{ marginLeft: 5, marginRight: 5 }} onPress={onShare}>
      <ShareIcon color={color}/>
    </TouchableOpacity>
  )
}
