export default function SubHeader({ stateVar, userName, toggleStateVar }) {
  return (
    <div className="w-full z-40 flex justify-center fixed top-12">
      <div className="w-4/5 flex mt-12 justify-between max-w-5xl align-center bg-white border-2 border-black py-2 px-4">
        <div className="flex align-center">
          <img
            src={stateVar === "WRITE" ? "/write.svg" : "album.svg"}
            alt=""
            className="mr-4 w-8"
          ></img>
          <h1 className="text-3xl font-bold leading-normal">
            {stateVar === "WRITE"
              ? "음악 로그 작성"
              : stateVar === "LIST"
              ? `${userName}님의 음악로그`
              : `${userName}님의 플레이어`}
          </h1>
        </div>
        <button
          className={`w-40 ml-auto font-semibold text bg-[#617FF5] hover:bg-[#E3E6F2] text-white  hover:text-black py-1 px-3 border-2 border-black`}
          onClick={() =>
            toggleStateVar((prevState) =>
              prevState === "WRITE" ? "LIST" : "WRITE"
            )
          }
        >
          {stateVar === "WRITE" ? "음악 로그 보기" : "로그 작성하기"}
        </button>
      </div>
    </div>
  );
}
