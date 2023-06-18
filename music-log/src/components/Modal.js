import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { getPlaybackState } from "@/pages/lib/Spotify";
import { data } from "autoprefixer";

//------------
const Modal = ({ isOpen, closeModal, setState }) => {
  //현재 로그인된 사용자의 세션 정보 가져오기
  const { data: session } = useSession();

  const [isPlaying, setIsPlaying] = useState(false);
  const [SongTitle, setSongTitle] = useState();
  const [SongArtist, setSongArtist] = useState("Artist");

  const getMyPlayState = async () => {
    const res = await fetch("/api/playState");
    //console.log("modal state Activated");
    if (res.status != 200) {
      //정상적 응답일 아닐 경우 isPlaying을 처음의 false로 냅둠
    } else {
      //정상적 응답일 경우 is_playing값을 isPlaying에 할당
      const { is_playing, item } = await res.json();
      //console.log("degub", item);
      setIsPlaying(is_playing);

      if (is_playing) {
        //노래 제목, 아티스트, 사진 업데이트
        setSongTitle(item.name);
        setSongArtist(item.artists[0].name);
      }
    }
  };
  useEffect(() => {
    getMyPlayState();
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div className="bg-white  border-2 border-black p-8">
        <p className="text-xl font-bold mb-2">
          {session
            ? `${session.session.user.name}님, 지금 ${SongArtist}의 ${SongTitle}을 듣고 있네요!`
            : "00님, 지금 00의 000을 듣고 있네요!"}
        </p>
        <p className="text-l mb-4">지금의 순간을 간단하게 남겨주세요</p>
        <p></p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-[#617FF5] hover:bg-[#E3E6F2] text-white  hover:text-black border-2 border-black font-bold py-2 px-4"
            onClick={setState}
          >
            작성하기
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 border-2 border-black"
            onClick={closeModal}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
