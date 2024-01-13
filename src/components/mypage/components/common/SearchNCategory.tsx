import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, TouchableOpacity } from "react-native";
import SearchBar from '../../../../common/SearchBar';
import { TextPretendard as Text } from '../../../../common/CustomText';
import Category, { ForestCategory } from '../../../../common/Category';
import Search from "../../../../assets/img/common/Search.svg";
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import styled from 'styled-components/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 5px;
  position:relative;
`
const Section = styled.View`
  height: 35px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
interface SearchNCategoryProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  checkedList: string[];
  setCheckedList: Dispatch<SetStateAction<string[]>>;
  label: string;
  type: boolean;
  setType: Dispatch<SetStateAction<boolean>>;
  setPage?: Dispatch<SetStateAction<number>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
  edit: boolean;
  forest?:boolean;
  isUser : boolean;
}

export function SearchNCategory({ setSearch, search, checkedList, setCheckedList, label, setType, type, setPage, setEdit, edit, forest, isUser }: SearchNCategoryProps) {
  const [mode, setMode] = useState<boolean>(true);
  const [view, setView] = useState<boolean>(false);
  const buttonAnimatedDisplay = useSharedValue(0);
  const buttonAnimatedPosition = useSharedValue(0);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(buttonAnimatedPosition.value, { duration: 350 }),
      display: 'flex',
      opacity: withTiming(buttonAnimatedDisplay.value, { duration: 350 }),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 5
    };
  })
  return (
    <Container>
      {
        <Animated.View style={buttonAnimatedStyle}>
          {
            mode ?
              <>
                <SearchBar
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                  style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, flex: 1, zIndex: 1 }}
                  placeholder="내용 입력 전"
                  placeholderTextColor={"#848484"}
                />
                <TouchableOpacity style={{ borderRadius: 12, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginHorizontal: 5, paddingHorizontal: 5, height: 25 }}
                  onPress={() => { setEdit(!edit) }}>
                  <Text style={{ fontSize: 12 }}>편집</Text>
                </TouchableOpacity>
                {/* boolean 타입 변수로 조정 */}
                {isUser && <TouchableOpacity style={{ backgroundColor: type ? '#FFFFFF' : '#D7D7D7', borderRadius: 20, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
                  onPress={() => { setType(!type); if (setPage) setPage(1) }}>
                  <Text style={{ fontSize: 12 }}>{label}</Text>
                </TouchableOpacity>}
                

              </>
              :
              <>
                {forest?<ForestCategory setPage={setPage} checkedList={checkedList} setCheckedList={setCheckedList} story={true} style={{marginVertical: 5, height: 40}} /> : <Category setPage={setPage} checkedList={checkedList} setCheckedList={setCheckedList} story={true} style={{ marginVertical: 0 }} />
              }
              </>
              }
        </Animated.View>
      }
      <Section>
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => {
          if (!view) {
            setView(true);
            buttonAnimatedPosition.value = 45;
            buttonAnimatedDisplay.value = 1;
          };
          if (view && mode) {
            setView(false);
            buttonAnimatedPosition.value = 0;
            buttonAnimatedDisplay.value = 0;
          }
          setMode(true)
        }}>
          <Search width={18} height={18} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => {
          if (!view) {
            setView(true);
            buttonAnimatedPosition.value = 45;
            buttonAnimatedDisplay.value = 1;
          };
          if (view && !mode) {
            setView(false);
            buttonAnimatedPosition.value = 0;
            buttonAnimatedDisplay.value = 0;
          }
          setMode(false)
        }}>
          <Menu width={18} height={18} />
        </TouchableOpacity>
      </Section>
    </Container>
  )
}

interface SearchNoCategoryProps {
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
  type: boolean;
  setType: Dispatch<SetStateAction<boolean>>;
  label: string;
  setPage?: Dispatch<SetStateAction<number>>;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
  isUser : boolean;
}

export function SearchNoCategory({ setSearch, search, type, setType, label, setPage, setEdit, edit, isUser }: SearchNoCategoryProps) {
  const [mode, setMode] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const buttonAnimatedDisplay = useSharedValue(0);
  const buttonAnimatedPosition = useSharedValue(0);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(buttonAnimatedPosition.value, { duration: 350 }),
      display: 'flex',
      opacity: withTiming(buttonAnimatedDisplay.value, { duration: 350 }),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 5
    };
  })

  return (
    <Container>
      {
        <Animated.View style={buttonAnimatedStyle}>
          {
            mode &&
              <>
                <SearchBar
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                  style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, flex: 1, zIndex: 1 }}
                  placeholder="내용 입력 전"
                  placeholderTextColor={"#848484"}
                />
                <TouchableOpacity style={{ borderRadius: 12, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginHorizontal: 5, paddingHorizontal: 5, height: 25 }}
                  onPress={() => { setEdit(!edit) }}>
                  <Text style={{ fontSize: 12 }}>편집</Text>
                </TouchableOpacity>
                {isUser && <TouchableOpacity style={{ backgroundColor: type ? '#FFFFFF' : '#D7D7D7', borderRadius: 20, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
                  onPress={() => { setType(!type); if (setPage) setPage(1) }}>
                  <Text style={{ fontSize: 12 }}>{label}</Text>
                </TouchableOpacity>}
                
              </>
           }
        </Animated.View>
      }
      <Section>
        <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => {
          if (!view) {
            setView(true);
            buttonAnimatedPosition.value = 45;
            buttonAnimatedDisplay.value = 1;
          };
          if (view && mode) {
            setView(false);
            buttonAnimatedPosition.value = 0;
            buttonAnimatedDisplay.value = 0;
          }
          setMode(true)
        }}>
          <Search width={18} height={18} />
        </TouchableOpacity>
      </Section>
    </Container>
  )
}
