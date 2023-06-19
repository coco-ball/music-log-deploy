export default function ListView({ logs, deleteLog }) {
  return (
    <div>
      {logs.map((log, index) => (
        <div key={index} className="pb-8">
          <div className="flex bg-white border-2 border-black w-auto h-auto hover:scale-105 hover:border-[#617FF5] transition-transform">
            <div className="w-1/4 bg-white p-4">
              <img
                className="w-auto rounded peer"
                src={log.cover}
                alt="앨범 커버"
              ></img>
            </div>
            <div key={log.id} className="w-3/4 bg-white p-4 relative">
              <p className="text-2xl font-bold text-xl mb-6">
                {log.title} - {log.artist}
              </p>
              <p
                className="text-l font-bold"
                style={{ display: "inline-block" }}
              >
                위치:{" "}
              </p>{" "}
              {log.location}
              <p className="mb-4"></p>
              <p
                className="text-l font-bold"
                style={{ display: "inline-block" }}
              >
                시간:{" "}
              </p>{" "}
              {log.datetime}
              <p className="mb-4"></p>
              <p className="text-l font-bold">남긴 메모</p>
              <p className="w-full">{log.text}</p>
              <button>
                <img
                  src="/close.svg"
                  onClick={() => deleteLog(log.id)}
                  className={
                    "absolute top-0 right-0 w-4 mt-2 mr-2 text-black font-serif hover:bg-white hover:text-cyan-700 text-xs"
                  }
                ></img>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex bg-white w-72 h-32 border-2 border-black opacity-0"></div>
    </div>
  );
}
