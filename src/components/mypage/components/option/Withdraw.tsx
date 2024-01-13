import React, { useState, useContext } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert, Modal } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../../pages/MyPage';
import { removeNickname, removeAccessToken, removeRefreshToken, } from '../../../../common/storage';
import { LoginContext } from '../../../../common/Context';
import FinishModal from '../../../../common/FinishModal';
import { Request } from '../../../../common/requests';
import Arrow from "../../../../assets/img/common/Arrow.svg";
import NextButton from '../../../../common/NextButton';


const WithdrawButton = styled.View`
    width: 300px;
    height: 40px;
    border-radius: 10px;
    border-color: #44ADF7;
    background: #44ADF7;
    align-items: center;
    justify-content: center;   
`;

const PasswordInput = styled.TextInput`
    width: 294px;
    height: 32px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const request = new Request();

const Withdraw = ({ navigation }: StackScreenProps<MyPageProps, 'withdraw'>) => {
    const [finishModal, setFinishModal] = useState<boolean>(false);
    const { isLogin, setLogin } = useContext(LoginContext);
    const withdrawConfirmAlert = () => {
        Alert.alert(
            "알림",
            "정말로 탈퇴하시겠습니까?",
            [
                {
                    text: "예",
                    onPress: withdraw,
                    style: 'destructive',
                },
                {
                    text: "아니오",
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }
    const withdraw = async () => {
        const response = await request.delete(`/mypage/withdraw/`, {});
        if (response.status == 200) {
            Alert.alert('알림', '회원 탈퇴가 성공적으로 수행되었습니다.', [{ text: '확인' }]);
            removeAccessToken();
            removeNickname();
            removeRefreshToken();
            setLogin(false);
            navigation.navigate('mypage');
        }
        else {
            console.error(response)
            Alert.alert('알림', '회원 탈퇴가 실패하였습니다.', [{ text: '확인' }]);
        }
        navigation.navigate('mypage');

    }

    return (
        <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1, paddingTop: 10 }}>
            <View style={{ position: 'relative', marginBottom: 30, width: '100%', marginTop: Platform.OS == 'ios' ? 5 : 0 }}>
                <Text style={TextStyles.title}>회원 탈퇴</Text>
                <TouchableOpacity style={{ left: 10, top: 5, position: 'absolute' }} onPress={() => { navigation.goBack() }}>
                    <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} color={'black'} />
                </TouchableOpacity>
            </View>
            <Modal visible={finishModal}>
                <FinishModal
                    navigation={() => navigation.navigate('login')}
                    setModal={setFinishModal}
                    title='회원 탈퇴 완료!'
                    subtitle={['다시 찾아와주세요']}
                />
            </Modal>
            <View style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                <Text style={TextStyles.draw}>회원 탈퇴</Text>
                <NextButton label='회원 탈퇴' onPress={withdrawConfirmAlert} style={{alignSelf: 'center', marginTop: 60}} />
            </View>
        </SafeAreaView>
    )
}

const TextStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.6,
        fontWeight: '700',
        alignSelf: 'center'
    },
    button: {
        overflow: 'hidden',
        width: 175,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#67D393',
        textAlign: 'center',
        lineHeight: 45,
        fontSize: 16,
        letterSpacing: -0.6,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    draw: {
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.6,
        alignSelf:'center',
        fontWeight: '700'
    }
})

export default Withdraw;
