export default function GridView({ logs }) {
  return (
    <div className="flex flex-wrap gap-5">
      {logs.map((log, index) => (
        <div key={index} className="w-32">
          <img
            className="peer w-full h-auto rounded"
            src={log.cover}
            alt="앨범 커버"
          ></img>
          <div className="invisible peer-hover:visible mr-4 bg-white border-2 border-black p-4 absolute flex w-800 z-40">
            <div className="w-44 flex-col justify-center">
              <img
                className="w-40 rounded mb-2"
                src={log.cover}
                alt="앨범 커버"
              ></img>
              <p className="text-center w-full font-bold text-xl mb-1 pr-4">
                {log.title}
              </p>
              <p className="text-center pr-4">{log.artist}</p>
            </div>
            <div>
              <p className="text-xl font-bold mb-1">위치</p>
              <p className="mb-4">{log.location}</p>
              <p className="text-xl font-bold mb-1">시간</p>
              <p className="mb-4">{log.datetime}</p>
              <p className="text-xl font-bold">남긴 메모</p>
              <p>{log.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
