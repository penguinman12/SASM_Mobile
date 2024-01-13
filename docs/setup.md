# 개발환경 구축
### 1. React Native
- Mac: https://dev-yakuza.posstree.com/ko/react-native/install-on-mac/   
- Window: https://dev-yakuza.posstree.com/ko/react-native/install-on-windows/

### 2. Git Fork
- Fork your own copy of sdp-tech/SASM_Mobile
- Git clone with VSCode

### 3. Property List
- 공유 받은 local.properties를 android 폴더에 넣기
- Info.plist를 ios/sasm 폴더에 넣기
- env.d.ts를 프로젝트 최상위 폴더에 넣기
- strings.xml을 android/app/src/main/res/values 폴더에 넣기
- GoogleService-Info.plist를 ios/sasm 폴더에 넣기
- google-services.json android/app 폴더에 넣기
- release.keystore android/app 폴더에 넣기

### 4. .env 파일 생성
- 프로젝트 최상위 폴더에 .env 파일 생성
- .env 파일 내에 SASM_API_URL를 key로 하여, 백엔드 통신 주소를 value로 지정하기
- 공유 받은 API 키 목록을 넣기

### 5. package.json 패키지 설치
```
npm install yarn
yarn install
```

### 6. (iOS의 경우) pod install 수행
- 프로젝트 최초 설정 시 또는 **이후 새로운 패키지 설치/삭제 시** 아래 명령어 수행
```
npx pod-install
```

### 7. Build
```
yarn react-native run-ios
yarn react-native run-android
``` 

### 8. 맵 초기 위치 설정
- Xcode Features > Location > Custom Location에서 위치 설정 후 reload   
ex. Latitude: 37.5, Longitude: 127.5


