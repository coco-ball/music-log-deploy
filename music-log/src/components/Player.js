import { useState } from "react";

export default function Player() {
  const [playing, setPlaying] = useState("PLAY");
  function togglePlaying() {
    setPlaying((prevState) => (prevState === "PLAY" ? "PAUSE" : "PLAY"));
  }

  return (
    <body className="w-auto flex mt-8">
      <div className="flex-col justify-center w-72 mr-4 bg-white rounded p-4">
        <img className="w-auto mb-4 rounded" src="/albumCover.jpeg"></img>
        <div className="flex jusify-between">
          <img className="float-left" src="/playlist.svg" alt=""></img>
          <img src="/rewind.svg" alt=""></img>
          <img
            src={playing === "PLAY" ? "/pause.svg" : "play.svg"}
            alt=""
            onClick={() => {
              togglePlaying();
            }}
          ></img>
          <img src="/forward.svg" alt=""></img>
          <img className="float-right" src="/album.svg" alt=""></img>
        </div>
      </div>
    </body>
  );
}
