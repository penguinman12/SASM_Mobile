import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import Close from "../../../assets/img/common/Close.svg";
import styled from "styled-components/native";
import PlaceUser from "../../../assets/img/Map/PlaceUser.svg";
import { Request } from "../../../common/requests";
import Popup from "../../../common/Popup";
import PlaceFormHeader from "./PlaceFormHeader";
import PlaceProfileForm from "./PlaceProfileForm";
import PlaceImageForm from "./PlaceImageForm";
import PlaceTimeForm from "./PlaceTimeForm";
import PlaceOwnerForm from "./PlaceOwnerForm";
import PlaceAddinfoForm from "./PlaceAddinfoForm";
import PlaceServiceForm from "./PlaceServiceForm";
import { useNavigation } from "@react-navigation/native";

export const HeaderPlaceForm = styled.View<{ color: string }>`
  background-color: ${(props) => props.color};
  height: 10%;
  display: flex;
  padding-top: 40px;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-between;
  align-items: flex-start;
  flex-flow: row;
`;
const Section = styled.View`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;
const Link = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  background-color: #67d393;
  margin-vertical: 50px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
`;
const MenuWrapper = styled.View`
  width: 85%;
  margin: auto;
  height: 60%;
  display: flex;
  flex-flow: column;
  justify-content: center;
`;
interface PlaceFormProps {
  setPlaceformModal: Dispatch<SetStateAction<boolean>>;
}

interface NextBtnProps {
  onPress: () => void;
  disability?: boolean;
  text?: string;
}

export interface ListProps {
  id: number;
  data: string;
  name: string;
  selected: boolean;
}

export interface formDataProps {
  place_name: string;
  category: string;
  vegan_category: string | null;
  tumblur_category: boolean | null;
  reusable_con_category: boolean | null;
  pet_category: boolean | null;
  // week_hours: string | null;
  mon_hours: string;
  tues_hours: string;
  wed_hours: string;
  thurs_hours: string;
  fri_hours: string;
  sat_hours: string;
  sun_hours: string;
  etc_hours: string;
  place_review: string;
  address: string;
  short_cur: string;
  phone_num: string;
  imageList: any[];
  snsList: string[] | null;
  [index: string]: any;
}

export function NextBtn({
  onPress,
  disability = false,
  text = "다음",
}: NextBtnProps) {
  const color = disability ? "#ACEFC3" : "#67d393";
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        marginTop: "auto",
        width: "45%",
        height: 45,
        borderRadius: 10,
        justifyContent: "center",
      }}
      onPress={onPress}
      disabled={disability}
    >
      <Text
        style={{
          ...TextStyles.Link,
          textAlign: "center",
          fontWeight: "400",
          margin: 0,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default function PlaceForm({
  setPlaceformModal,
}: PlaceFormProps): JSX.Element {
  const [selectedDay, setSelectedDay] = useState([
    // { id: 0, name: "공휴일", selected: false },
    { id: 1, data: "mon_hours", name: "월요일", selected: false },
    { id: 2, data: "tues_hours", name: "화요일", selected: false },
    { id: 3, data: "wed_hours", name: "수요일", selected: false },
    { id: 4, data: "thurs_hours", name: "목요일", selected: false },
    { id: 5, data: "fri_hours", name: "금요일", selected: false },
    { id: 6, data: "sat_hours", name: "토요일", selected: false },
    { id: 7, data: "sun_hours", name: "일요일", selected: false },
  ]);
  const [owner, setOwner] = useState(false);

  const [tab, setTab] = useState<number>(0);
  const [closePopup, setClosePopup] = useState<boolean>(false);
  const [formData, setFormData] = useState<formDataProps>({
    place_name: "",
    category: "",
    vegan_category: null,
    tumblur_category: null,
    reusable_con_category: null,
    pet_category: null,
    week_hours: "",
    mon_hours: "",
    tues_hours: "",
    wed_hours: "",
    thurs_hours: "",
    fri_hours: "",
    sat_hours: "",
    sun_hours: "",
    etc_hours: "",
    place_review: "",
    address: "",
    short_cur: "",
    phone_num: "",
    imageList: [],
    snsList: null,
  });

  useEffect(() => {
    if (closePopup) {
      Alert.alert("나가시겠습니까?", "입력하신 정보는 저장되지 않습니다.", [
        {
          text: "머무르기",
          style: "cancel",
          onPress: () => setClosePopup(false),
        },
        {
          text: "나가기",
          style: "destructive",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => setPlaceformModal(false),
        },
      ]);
    }
  }, [closePopup]);

  return (
    <Section>
      {tab == 0 ? (
        <TouchableOpacity
          onPress={() => {
            setPlaceformModal(false);
          }}
        >
          <Close style={{ top: "60%", margin: "8%" }} color="#000000" />
        </TouchableOpacity>
      ) : (
        <PlaceFormHeader
          onLeft={() =>
            setTab((prevTab) => {
              if (prevTab == 2 && !owner) return 0;
              else return prevTab - 1;
            })
          }
          onRight={() => setClosePopup(true)}
        />
      )}

      {
        {
          0: (
            <MenuWrapper>
              <View>
                <Text style={TextStyles.title}>SASM에 없는</Text>
                <Text style={TextStyles.title}>장소를 제보해주세요</Text>
              </View>
              <Link
                onPress={() => {
                  setOwner(false);
                  setTab(2);
                }}
              >
                <Text
                  style={{
                    ...TextStyles.title,
                    color: "#FFFFFF",
                    marginLeft: 0,
                  }}
                >
                  이미지로 제보하기
                </Text>
                <PlaceUser />
              </Link>
              {/* <Link
                onPress={() => {
                  setOwner(true);
                  setTab(1);
                }}
              >
                <Text
                  style={{
                    ...TextStyles.title,
                    color: "#FFFFFF",
                    marginLeft: 0,
                  }}
                >
                  사업주입니다!
                </Text>
                <PlaceUser />
              </Link> */}
            </MenuWrapper>
          ),
          1: (
            <PlaceOwnerForm
              NextBtn={
                <NextBtn
                  onPress={() => {
                    setTab((prev) => prev + 1);
                  }}
                  disability={false}
                />
              }
            />
          ),
          2: (
            <PlaceProfileForm
              setTab={setTab}
              formData={formData}
              setFormData={setFormData}
            />
          ),
          3: (
            <PlaceImageForm
              setTab={setTab}
              formData={formData}
              setFormData={setFormData}
            />
          ),
          4: (
            <PlaceTimeForm
              setTab={setTab}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              formData={formData}
              setFormData={setFormData}
            />
          ),
          5: (
            <PlaceAddinfoForm
              setTab={setTab}
              formData={formData}
              setFormData={setFormData}
            />
          ),
          6: (
            <PlaceServiceForm
              formData={formData}
              setFormData={setFormData}
              finish={() => setPlaceformModal(false)}
            />
          ),
        }[tab]
      }
    </Section>
  );
}

const TextStyles = StyleSheet.create({
  Link: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    lineHeight: 35,
  },
  content: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000000",
    marginTop: 15,
    marginBottom: 25,
    marginLeft: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    color: "#000000",
    letterSpacing: -0.6,
    marginLeft: 25,
  },
});
