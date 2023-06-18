import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// import PostLog from "@/src/components/PostLog";

//firebase 관련 모듈을 불러옵니다.
import { db } from "./firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";
import GridView from "./GridView";
import ListView from "./ListView";

// // DB의 postlogs 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
const postlogCollection = collection(db, "logs");

const MusicLog = ({ onDelete }) => {
  const [viewMode, setViewMode] = useState("GRID");

  const { data: session } = useSession();
  const [logs, setLogs] = useState([]);

  // Firebase에서 불러오는 함수
  const getLogs = async () => {
    if (!session?.session?.user?.name) return;
    const q = query(
      postlogCollection,
      where("userName", "==", session.session.user.name),
      orderBy("datetime", "desc")
    );

    // Firestore에서 불러오기
    const results = await getDocs(q);
    const newLogs = [];

    // 가져온 목록을 newLogs 배열에 담습니다.
    results.docs.forEach((doc) => {
      //results에 저장된 데이터를 newTodos 배열에 담습니다.
      newLogs.push({ id: doc.id, ...doc.data() });
    });

    setLogs(newLogs);
  };

  useEffect(() => {
    getLogs();
  }, [session]);

  /*const deletelog = (id) => {
    // Firestore 에서 해당 id를 가진 할 일을 삭제합니다.
    const postlogDoc = doc(postlogCollection, id);
    deleteDoc(postlogDoc);

    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    setlogs(
      logs.filter((log) => {
        return log.id !== id;
      })
    );
  };*/

  const deleteLog = (id) => {
    // Firestore에서 해당 id를 가진 로그 항목을 삭제합니다.
    const logDoc = doc(postlogCollection, id);
    deleteDoc(logDoc);

    // 로그 항목을 `logs` 배열에서도 삭제합니다.
    setLogs(logs.filter((log) => log.id !== id));
  };

  return (
    <div className="w-auto mt-8">
      <button className="mb-4 absolute top-0 right-40 w-4 mt-2 mr-36">
        <div className="w-6">
          <img
            src="/grid.svg"
            style={{ opacity: viewMode === "GRID" ? 1 : 0.3 }}
            className="hover:opacity-100"
            onClick={() => {
              setViewMode("GRID");
            }}
          />
        </div>
      </button>
      <button className="mb-4 absolute top-0 right-40 w-4 mt-2 mr-28">
        <div className="w-6">
          <img
            src="/list.svg"
            style={{ opacity: viewMode === "GRID" ? 0.3 : 1 }}
            className="hover:opacity-100"
            onClick={() => {
              setViewMode("LIST");
            }}
          />
        </div>
      </button>
      {viewMode === "GRID" ? (
        <GridView logs={logs}></GridView>
      ) : (
        <ListView logs={logs} deleteLog={deleteLog}></ListView>
      )}
    </div>
  );
};

export default MusicLog;
