import React, { useState, useEffect, useLayoutEffect } from "react";
import { useSession } from "next-auth/react";

import Modal from "./Modal";
import Header from "./Header";
import Player from "./Player";
import PostLog from "./PostLog.js";
import MusicLog from "./MusicLog.js";
import Notice, { makeNoti } from "./Notice.js";
import MusicBar from "./MusicBar";

import { getPlaybackState } from "@/pages/lib/Spotify";
import { data } from "autoprefixer";
import SubHeader from "./SubHeader";

const MainPage = () => {
  //------------------------------------------------------
  //메인 페이지 아래로 모드에 따라 대응되는 컴포넌트 렌더링
  const [stateVar, setStateVar] = useState("LIST");

  function toggleStateVar(mode) {
    setStateVar(mode);
  }

  //------------------------------------------------------
  //모달

  //세션 사용 위해
  const { data: session } = useSession();
  //모달을 열기 위한 함수
  const openModal = () => {
    setModalOpen(true);
  };
  //모달을 닫기 위한 함수
  const closeModal = () => {
    setModalOpen(false);
  };
  //modalOpen은 모달의 열림 여부- 초기값 false/ setModalOpen 함수는 모달의 열림 여부를 업데이트
  const [modalOpen, setModalOpen] = useState(false);

  //-------------------------------------------------------
  //api로 가져올 값들

  const [list, setList] = useState([]);
  const [userId, setUserId] = useState([]);
  const [userName, setUserName] = useState([]);
  const [userImg, setUserImg] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState("Track");
  const [songArtist, setSongArtist] = useState("Artist");
  const [imageUrl, setImageUrl] = useState(
    "https://cdn-icons-png.flaticon.com/512/659/659056.png"
  );
  //장소는 아직
  const location = "서울대학교 83동";

  const [lastUpdatedTime, updateTime] = useState("");
  const [lastPushTime, updatePushTime] = useState("");

  //-------------------------------------------------------
  //API로 값 기져오고 변수(state)에 저장

  const initUpdateTime = async () => {
    const time = localStorage.getItem("lastUpdateTime");
    const time2 = localStorage.getItem("lastPushTime");
    console.log("time2 check: ", time2);
    updateTime(time);
    if (time2) {
      updatePushTime(time2);
    } else {
      const tmp = new Date().toISOString();
      updatePushTime(tmp);
    }
    console.log("init last push time state check: ", lastPushTime);
  };

  useEffect(() => {
    initUpdateTime();
  }, []);

  const getMyPlayState = async () => {
    const res = await fetch("/api/playState");
    if (res.status != 200) {
      //정상적 응답일 아닐 경우 isPlaying을 처음의 false로 냅둠
      console.log("not playing -> recently played");
      setSongTitle(localStorage.getItem("title"));
      setSongArtist(localStorage.getItem("singer"));
      setImageUrl(localStorage.getItem("cover"));
    } else {
      //정상적 응답일 경우 is_playing값을 isPlaying에 할당
      const { is_playing, item } = await res.json();
      console.log("is playing!!!");
      setIsPlaying(is_playing);
      setSongTitle(item.name);
      setSongArtist(item.artists[0].name);
      setImageUrl(item.album.images[0].url);
      localStorage.setItem("title", songTitle);
      localStorage.setItem("singer", songArtist);
      localStorage.setItem("cover", imageUrl);
      console.log("로컬 스토리지 업데이트됐음");
    }
  };
  //컴포넌트가 렌더링될때 getMyPlayState를 자동으로 실행하기 위한 함수
  useLayoutEffect(() => {
    getMyPlayState();

    const interval = setInterval(() => {
      getMyPlayState();
    }, 10000); //10초에 한번씩 업데이트

    return () => {
      clearInterval(interval);
    };
  }, [stateVar]);

  //레퍼런스에서 가져온 사용하지 않는 함수
  /*const getMyPlaylists = async () => {
    const res = await fetch("/api/playlists");
    const { items } = await res.json();
    setList(items);
  };*/

  const getUserProfile = async () => {
    const res = await fetch("/api/currentUser");
    if (res.status != 200) {
    } else {
      const { id, images, display_name } = await res.json();
      setUserId(id);
      setUserName(display_name);
      setUserImg(images[0].url);
    }
  };

  useLayoutEffect(() => {
    getUserProfile();
  }, [session]);

  //최근 재생 목록 불러오려고 시도한 코드
  /*
  const getRecentlyPlayed = async() => {
    const res = await fetch("/api/recentlyPlayed");
    if (res.status != 200) {
      //정상적 응답일 아닐 경우 isPlaying을 처음의 false로 냅둠
    } else {
      //정상적 응답일 경우 is_playing값을 isPlaying에 할당
      const { total, items } = await res.json();
      if (total != 0) {
        setSongTitle(items[0].track.name);
        setSongArtist(items[0].artists[0].name);
        setImageUrl(items[0].album.images[0].url);
      }
    }
  }*/

  const wantedDiff = 1000 * 60; //테스트용으로 1초로 설정

  //모달 코드
  /*const checkModal = async () => {
    console.log("check modal called!!!");
    if (isPlaying) {
      const time1 = new Date(lastUpdatedTime);
      const time2 = new Date();

      const timeDifference = time2 - time1; // 현재 시간과 변환한 시간의 간격
      //const threeHoursInMillis = 3 * 60 * 60 * 1000; // 3시간을 밀리초로 변환

      console.log("timeDiff: ", timeDifference);

      if (timeDifference > wantedDiff) {
        openModal();
      }
    }
  };

  useEffect(() => {
    checkModal();
  }, [isPlaying]);*/

  //------------------------------------------------------
  //변수들을 postLog.js에 넘기기 위해 배열 생성(너무 많아서!)
  const postLogData = {
    isPlaying: isPlaying,
    songTitle: songTitle,
    songArtist: songArtist,
    imageUrl: imageUrl,
    userId: userId,
    userName: userName,
    userImg: userImg,
    location: location,
  };

  //푸시알림 보내는 makeNoti() 함수 정의
  function makeNoti() {
    // 사용자 응답에 따라 단추를 보이거나 숨기도록 설정
    if (
      Notification.permission === "denied" ||
      Notification.permission === "default"
    ) {
      alert("알림이 차단된 상태입니다. 알림 권한을 허용해주세요.");
    } else {
      getMyPlayState();
      if (isPlaying) {
        let notification = new Notification("Music Log", {
          body: `지금 ${songArtist}의 ${songTitle}를 듣고 계시네요! 지금의 순간을 간단하게 남겨주세요.`,
          //icon: ".png"
        });

        //알림 클릭 시 이벤트
        notification.addEventListener("click", () => {
          setStateVar("WRITE");
        });
      }
    }
  }

  const wantedDiff2 = 1000 * 60 * 10; //마지막 업데이트로부터 5분 이후라면 푸시
  const wantedDiff3 = 1000 * 60 * 10; //마지막 푸시로부터 3분 이후라면 푸시

  const sendPush = async () => {
    console.log("sendPush activated");
    const time1 = new Date(lastUpdatedTime);
    const time2 = new Date();

    const timeDifference = time2 - time1; // 현재 시간과 변환한 시간의 간격
    //const threeHoursInMillis = 3 * 60 * 60 * 1000; // 3시간을 밀리초로 변환
    if (timeDifference > wantedDiff2) {
      console.log("마지막 업데이트로부터 시간이 지났음");
      updatePushTime(localStorage.getItem("lastPushTime"));
      const time3 = new Date(lastPushTime);
      console.log("마지막 푸시 시간: ", lastPushTime);
      const timeDifference2 = time2 - time3;
      if (timeDifference2 > wantedDiff3) {
        console.log("마지막 푸시로부터 시간이 지났음");
        const str = new Date().toISOString();
        localStorage.setItem("lastPushTime", str);
        updatePushTime(str);
        //console.log("state 업데이트 체크: ", lastPushTime);
        makeNoti();
      }
    }
  };

  useEffect(() => {
    sendPush();

    const interval = setInterval(() => {
      sendPush();
    }, 60000); // 60000 milliseconds = 1 minute

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log("useeffect로 state 업데이트 체크: ", lastPushTime);
  }, [lastPushTime]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        username={userName}
        userImg={userImg}
        setStateVar={setStateVar}
      ></Header>
      <div className="flex-grow flex justify-center w-5xl">
        <div id="area" className="flex flex-col items-center max-w-5xl mx-auto">
          <SubHeader
            stateVar={stateVar}
            userName={userName}
            toggleStateVar={toggleStateVar}
          ></SubHeader>
          <div className="w-full flex justify-center mt-36">
            <div className="flex-col justify-center max-w-5xl">
              <div className="contents">
                {stateVar === "PLAYER" ? (
                  <Player></Player>
                ) : stateVar === "WRITE" ? (
                  <div className="transition-all">
                    <PostLog
                      setStateVar={setStateVar}
                      postLogData={postLogData}
                      updateTime={updateTime}
                    ></PostLog>
                  </div>
                ) : (
                  <div className="transition-all">
                    <MusicLog></MusicLog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {stateVar === "LIST" ? (
        <MusicBar
          postLogData={postLogData}
          setStateVar={setStateVar}
        ></MusicBar>
      ) : (
        <div></div>
      )}

      <Modal
        isOpen={modalOpen}
        closeModal={closeModal}
        //setState 속성에 익명의 화살표 함수를 전달
        setState={() => {
          //setStateVar 함수를 호출하여 stateVar 상태 변수의 값을 "WRITE"로 변경
          setStateVar("WRITE");
          closeModal();
        }}
      ></Modal>
    </div>
  );
};
export default MainPage;
