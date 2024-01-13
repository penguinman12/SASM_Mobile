import React, { ReactNode } from "react";
import {
  View,
  TextInputProps,
  ViewStyle,
  TouchableOpacityProps,
  TextStyle,
} from "react-native";
import { TextPretendard as Text } from "./CustomText";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Input = styled.TextInput<{ isAlert: boolean | undefined }>`
  width: 85%;
  border-bottom-width: 1px;
  border-color: ${(props) => (props.isAlert ? "#FF4D00" : "#C0C0C0")};
  font-size: 16px;
  height: 44px;
  padding-vertical: 10px;
`;

interface InputProps extends TextInputProps {
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  //필수 입력 사항 * 추가
  isRequired?: boolean;
  //잘못 입력되거나 잘못된 양식일 경우 보여주는 빨간 텍스트
  alertLabel?: string;
  descriptionLabel?: string;
  isAlert?: boolean;
  readonly?: boolean;
  children?: ReactNode;
}

export default function InputWithLabel({
  isAlert,
  alertLabel,
  descriptionLabel,
  isRequired,
  containerStyle,
  label,
  labelStyle,
  onChangeText,
  placeholder,
  value,
  readonly,
  children,
  ...rest
}: InputProps): JSX.Element {
  return (
    <View
      style={{
        ...containerStyle,
        height: 80,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Text
        style={labelStyle ? labelStyle : {
          width: "85%",
          textAlign: "left",
          fontSize: 14,
          lineHeight: 18,
          letterSpacing: -0.6,
        }}
      >
        {label}
        <Text style={{ color: "#FF4D00", lineHeight: 18 }}>
          {isRequired && " *"}
        </Text>
      </Text>
      <Input
        placeholderTextColor={"#848484"}
        isAlert={isAlert}
        value={value}
        placeholder={placeholder}
        autoCapitalize={"none"}
        spellCheck={false}
        onChangeText={onChangeText}
        {...rest}
      />
      <Text
        style={{ width: "85%", fontSize: 10, lineHeight: 18, color: descriptionLabel ? '#67D393':"#FF4D00" }}
      >
        {isAlert && alertLabel}{descriptionLabel && descriptionLabel}
      </Text>
      {children}
    </View>
  );
}

const InputTouch = styled.TouchableOpacity`
  width: 85%;
  border-bottom-width: 1px;
  border-color: #c0c0c0;
  padding-vertical: 10px;
  height: 44px;
`;

interface InputTouchProps extends TouchableOpacityProps {
  label?: string;
  containerStyle?: ViewStyle;
  //필수 입력 사항 * 추가
  isRequired?: boolean;
  onPress: () => void;
  children: ReactNode;
}

export function InputTouchWithLabel({
  label,
  onPress,
  children,
  isRequired,
  containerStyle,
}: InputTouchProps) {
  return (
    <View
      style={{
        ...containerStyle,
        height: 80,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          width: "85%",
          textAlign: "left",
          fontSize: 12,
          lineHeight: 18,
          letterSpacing: -0.6,
        }}
      >
        {label}
        <Text style={{ color: "#FF4D00", lineHeight: 18 }}>
          {isRequired && " *"}
        </Text>
      </Text>
      <InputTouch onPress={onPress}>{children}</InputTouch>
    </View>
  );
}
