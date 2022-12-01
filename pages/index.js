import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { accessRights, getBoards } from "../firebase/FirebaseFunctions";

export default function Home() {

  const [Loading, setLoading] = useState(true);
  const [boards, setBoards] = useState([])

  const router = useRouter()

  useEffect(() => {
    accessRights(localStorage.getItem('peretz-customer-user-id'), router)

    if (!localStorage.getItem('peretz-customer-auth-token')) {
      router.push('/login')
    }

    getBoards({ setBoards, setLoading })
  }, [])

  return (
    <div>
      {/* Loading Wheel */}
      <div className={`double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`} style={{ display: !Loading && "none" }}></div>

      <NavBar setLoading={setLoading} />

      <div className="flex justify-center">
        <div className="w-[90%]">

          <div className="mt-10 mb-4 text-5xl text-gray-200 font-bold">Your Projects</div>

          {
            boards ?
              boards.map((board, index) => {
                return (
                  <div className="text-white font-semibold w-52 h-32 bg-[#161B22] flex flex-col justify-center rounded-md mt-4 px-3 border border-gray-400 cursor-pointer" key={index}
                    onClick={() => router.push(`/${board.boardName}`)}
                  >
                    <div>
                      <div className="text-sm">Board Name: {board.boardName}</div>
                      <div className="text-sm my-2">Customer: {board.customer}</div>
                      <div className="text-sm">Project Amount: <span className="text-green-500">${board.boardPrice}</span> </div>
                    </div>
                  </div>
                )
              })
              :
              <div className="text-lg text-gray-300 font-bold mt-6">No Projects...</div>
          }

        </div>
      </div>

    </div>
  )
}
