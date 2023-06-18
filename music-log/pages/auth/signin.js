import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>; // 세션 로딩 중에 표시할 내용을 설정합니다.
  }

  if (session) {
    router.push("/"); // 로그인된 세션이 있을 경우, 페이지 이동을 처리합니다.
    return null; // null을 반환하여 초기 렌더링 단계에서 아무것도 렌더링하지 않습니다.
  }

  return (
    <div className="h-screen bg-gradient-to-b from-[#617FF5] to-[#e5e7eb]">
      <div className="grid ml-20">
        <div
          className="mt-10 mb-10 ml-10 text-8xl font-extrabold text-white"
          id="title"
        >
          Music Log
        </div>
        <div className="ml-10 grid grid-cols-2 gap-8">
          <div id="text" className="mt-5">
            <div className="text-3xl font-bold">
              지금 듣고 있는 노래로
              <br />
              하루의 기록을 남겨보세요
            </div>
            <div className="font-semibold mt-5 mb-10">
              Music Log는 사용자가 현재 듣고 있는 노래를 기반으로
              <br />
              하루의 음악 로그를 남기는 앱입니다.
              <br />이 앱은 Spotify API와 연동하여 사용자가
              <br />
              현재 재생 중인 노래 정보를 실시간으로 가져옵니다.
              <br />
              <br />
              이제 Music Log와 함께 음악 청취를 기록하고,
              <br />
              당신만의 음악 세계를 탐험해보세요!
            </div>
            <button
              className={`w-40
                p-3 mb-4 mt-4
                bg-[#617FF5] text-white
                border border-black border-2
                hover:bg-white hover:text-[#617FF5]
                text-xl font-bold
                shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]`}
              onClick={() => signIn()}
            >
              SIGN IN
            </button>
          </div>
          <div id="image" className="w-1000">
            <img
              src="/front.svg"
              alt="listening music"
              style={{ width: "75%", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
