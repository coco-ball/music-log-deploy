import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

//firebase 관련 모듈을 불러옵니다.
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  //where,
} from "firebase/firestore";
import { data } from "autoprefixer";

const postlogCollection = collection(db, "logs");

export default function PostLog({ setStateVar, postLogData, updateTime }) {
  const { data: session } = useSession();
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState("");
  const [textSize1, setTextSize1] = useState("3xl");
  const [textSize2, setTextSize2] = useState("2xl");

  const [currentLocation, setCurrentLocation] = useState("Loading...");

  const textSizeEdit = async () => {
    console.log("textSizeEdit activated");
    if (postLogData.songTitle.length > 15) {
      if (postLogData.songTitle.length > 30) {
        setTextSize1("xl");
      } else {
        setTextSize1("2xl");
      }
    } else {
      setTextSize1("3xl");
    }
    if (postLogData.songArtist.length > 20) {
      setTextSize2("xl");
    }
  };

  useEffect(() => {
    const intervalText = setInterval(() => {
      textSizeEdit();
    }, 10000);

    return () => {
      clearInterval(intervalText);
    };
  }, []);

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDuljB_xu6sRdGsIx1MzW1wsaoc26ANwMI`
            );
            const data = await response.json();

            console.log(data);

            console.log(data.results[1].formatted_address);
            if (data.status === "OK") {
              //const addressComponents = data.results[0].address_components;
              let formattedAddress = data.results[1].formatted_address;

              // 주소 컴포넌트에서 원하는 부분을 가져와서 주소 형식 생성
              /*for (let i = 0; i < addressComponents.length; i++) {
                const component = addressComponents[i];
                const componentType = component.types[0];
                
                if (componentType === 'locality') {
                  formattedAddress += component.long_name;
                } else if (componentType === 'administrative_area_level_1') {
                  formattedAddress += ` ${component.short_name}`;
                } else if (componentType === 'administrative_area_level_2') {
                  formattedAddress += ` ${component.long_name}`;
                } else if (componentType === 'postal_code') {
                  formattedAddress += ` (${component.long_name})`;
                }
              }*/

              setCurrentLocation(formattedAddress);
            } else {
              console.log("Geocoding API request failed.");
              const baseloc = "대한민국 서울특별시 관악구 신림동";
              setCurrentLocation(baseloc);
            }
          } catch (error) {
            console.log("Error occurred while fetching geocoding data:", error);
            const baseloc = "대한민국 서울특별시 관악구 신림동";
            setCurrentLocation(baseloc);
          }
        },
        (error) => {
          console.log(error);
          const baseloc = "대한민국 서울특별시 관악구 신림동";
          setCurrentLocation(baseloc);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      const baseloc = "대한민국 서울특별시 관악구 신림동";
      setCurrentLocation(baseloc);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getpostlogs = async () => {
    // Firestore 쿼리를 만듭니다.
    // const q = query(postlogCollection);

    if (!session?.session?.user?.name) return;
    const q = query(
      postlogCollection,
      where("userName", "==", session.session.user.name), //userId로 식별하려면 어떻게?
      orderBy("datetime", "asc")
    );

    // Firestore 에서 할 일 목록을 조회합니다.
    const results = await getDocs(q);
    const newpostlogs = [];

    // 가져온 할 일 목록을 newTodos 배열에 담습니다.
    results.docs.forEach((doc) => {
      // console.log(doc.data());
      // id 값을 Firestore 에 저장한 값으로 지정하고, 나머지 데이터를 newTodos 배열에 담습니다.
      newpostlogs.push({ id: doc.id, ...doc.data() });
    });

    setLogs(newpostlogs); //todos 배열 업데이트
  };

  useEffect(() => {
    getpostlogs();
  }, [session]);

  const saveLog = async () => {
    if ((input.trim() === "") | !postLogData.isPlaying) return;

    //const date = new Date().toISOString().substring(0, 10);
    //const time = new Date().toISOString().substring(12, 19);
    //const hours = (parseInt(time.substring(0, 2)) + 7).toString().padStart(2, "0");
    //const modifiedTime = hours + ":"+time.substring(2);

    const now = new Date();
    const date = String(now).substring(0, 16);
    const hour = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0"); //number이기 때문에 padStart 붙일 수 없음. String 변환해주어야한다.

    const docRef = await addDoc(postlogCollection, {
      userName: postLogData.userName,
      userId: postLogData.userId,
      location: `${currentLocation}`,
      datetime: `${date} ${hour}:${minutes}:${second}`,
      cover: postLogData.imageUrl,
      title: postLogData.songTitle,
      artist: postLogData.songArtist,
      text: input,
    });
    alert("오늘의 음악 로그가 저장되었습니다.");

    setLogs([
      ...logs,
      {
        id: docRef.id,
        userId: postLogData.userId,
        userName: postLogData.userName,
        location: `${currentLocation}`,
        //datetime: date + " " + time,
        datetime: `${date} ${hour}:${minutes}:${second}`,
        cover: postLogData.imageUrl,
        title: postLogData.songTitle,
        artist: postLogData.songArtist,
        text: input,
      },
    ]);
    setInput("");
    setStateVar("LIST");

    const currentTime = new Date().toISOString();
    updateTime(currentTime);
    localStorage.setItem("lastUpdateTime", currentTime);
  };

  // console.log(logs);
  // useEffect(() => {
  //   console.log(logs);
  // }, [logs]);

  // firebase 관련 명령
  //spotify API연동-->userid, 노래 title, artist, album cover.. 총 7개 항목 불러오기 -->

  return (
    <body className="w-auto mt-12 min-w-min flex bg-white rounded p-4 border-2 border-black">
      <div className="w-72 mr-12 ">
        <img
          // className="w-auto mb-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
          className="w-auto mb-4"
          src={postLogData.imageUrl}
        ></img>
        <p className={`text-center text-${textSize1} font-bold mb-1`}>
          {postLogData.songTitle}
        </p>
        <p className={`text-center text-${textSize2} mb-1`}>
          {postLogData.songArtist}
        </p>
        <p className="text-center text-xs mt-4">
          {postLogData.isPlaying === true
            ? "지금 듣고 있는 노래"
            : "최근에 들은 노래"}
        </p>
      </div>
      <div className="w-full">
        <p className="text-xl font-bold mb-1">지금 어디에 계시나요?</p>
        <p className="mb-4">{currentLocation}</p>
        {/*<p className="mb-4">{postLogData.location}</p>*/}
        {/* <p className="text-2xl font-bold mb-1">시간</p>
          <p className="mb-4">{datetime}</p> */}
        <p className="text-xl font-bold mb-1">
          지금 뭐하고 계시나요? 간단한 메모를 남겨주세요.
        </p>
        <textarea
          id="input-text"
          type="text"
          className={`w-full h-48 p-1 mt-2 bg-[#E3E6F2]
          border-2 border-black
          focus:outline-none focus:bg-[#E3E6F2]
          `}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button
          className={`float-right p-1 ml-auto mt-1
          bg-[#617FF5] hover:bg-[#E3E6F2] 
          text-white text-sm
          border-2 border-black`}
          onClick={() => saveLog()}
        >
          저장하기
        </button>
      </div>
    </body>
  );
}

//데이터 저장하는 함수 지정한 후 맨 마지막에 alert('오늘의 음악 로그가 저장되었습니다.'); 코드 추가해서 사용자가 자신의 코드가 저장됨을 알게 하면 좋을 것 같아요
// 저장하기 버튼 클릭 시 데이터 저장하는 함수
/*
function saveData() {
  const userId = exData.getElementById(' ').textContent;
  const location = document.getElementById('  ').value;
  const datetime = document.getElementById('').value;
  const title = document.getElementById(' ').textContent;
  const artist = document.getElementById(' ').textContent;
  /*const albumCover = exData.getElementById(' ').src;*/
//const text = document.getElementById('text-input').value;

// 여기서 데이터를 데이터베이스에 저장하는 로직을 추가-firebase 연동?
// 데이터베이스에 저장되는 데이터는 userid, location, datetime, title, artist, text.. *앨범커버도 저장해야?

//alert('오늘의 음악 로그가 저장되었습니다.');
//}

// 저장하기 버튼에 이벤트 리스너 추가
//const saveButton = document.getElementById('save-button');
//saveButton.addEventListener('click', saveData);

//firebase: 모듈 불러오기->DB만들기

//  ->새로 생성된 데이터 firebase DB에 집어넣어 저장(+alert)
//  ->(MusicLog.js-사실상 정보 리스트/에서 firebase의 DB 하나하나 불러오기 .map)
// 리턴에 <button classname={~~} onClick={() => saveButton()} > 요렇게 넣어주기 // savelog

// {data?.user?.name}'s 음악 로그
/*
  <ul>
{todos.map((todo) => (
  <TodoItem
    key={todo.id}
    todo={todo}
    onToggle={() => toggleTodo(todo.id)}
    onDelete={() => deleteTodo(todo.id)}
  />
  */
