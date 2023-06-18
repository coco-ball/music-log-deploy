import { signOut } from "next-auth/react";

export default function Header({ username, userImg, setStateVar }) {
  return (
    // <div className="bg-white m-">
    //   <button
    //     className={`fixed top-4 right-40
    //             bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded`}
    //     onClick={() => signOut()}
    //   >
    //     Logout
    //   </button>
    // </div>

    <header className="fixed top-0 w-full flex justify-between items-center border-b-2 border-black gap-10 px-8 py-3 bg-white z-50">
      <button
        className="font-bold ml-32"
        onClick={() => {
          setStateVar("LIST");
        }}
      >
        뮤직 로그
      </button>
      <div className="flex align-middle">
        <div className="flex items-center mr-6 ">
          <img className="w-8 h-8 rounded-full mr-2" src={userImg}></img>
          <span className="font-bold text-sm">{username}</span>
        </div>
        <button
          className={`h-8 hover:text-blue-600 text-sm text-black font-bold py-1 px-2 rounded`}
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
