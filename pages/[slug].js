import { ScrollArea } from "@mantine/core";
import { ref, set } from "firebase/database";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { getBoardsData } from "../firebase/FirebaseFunctions";
import { database } from "../firebase/initFirebase";

const Column = dynamic(() => import("../templates/slug/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
    const newTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = newTaskIds.splice(startIndex, 1);
    newTaskIds.splice(endIndex, 0, removed);

    const newColumn = {
        ...sourceCol,
        taskIds: newTaskIds,
    };

    return newColumn;
};

export default () => {

    const router = useRouter();
    const [Loading, setLoading] = useState(true);
    const [boardsData, setBoardsData] = useState({})

    useEffect(() => {
        if (!localStorage.getItem('peretz-customer-auth-token')) {
            router.push('/login')
        }

        if (router.query.slug) {
            getBoardsData(router.query.slug, setBoardsData)
            setTimeout(() => {
                setLoading(false)
            }, 700);
        }
    }, [router.query.slug])

    return (
        <div>
            {/* Loading Wheel */}
            <div className={`double-up fixed w-screen h-screen z-50 ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`} style={{ display: !Loading && "none" }}></div>

            <NavBar />

            <div className="flex justify-center bg-[#0E1012] min-h-screen w-full text-white pt-10">
                <div className="max-w-[1100px] w-full">
                    <div className="w-full flex justify-between items-center pb-6">
                        <div className="text-3xl font-bold">
                            {router.query.slug}
                        </div>
                        <Link href="/"><button className="text-white text-lg px-4 py-1 rounded-sm bg-[#238636] hover:bg-[#2daa46] active:bg-[#238636] ">Go Back</button></Link>
                    </div>


                    <ScrollArea className="w-full pb-6">
                        <div className="w-full flex">
                            {
                                boardsData?.columnOrder?.map((columnId) => {
                                    const column = boardsData.columns[columnId];

                                    if (!column.taskIds) {
                                        set(ref(database, `${router.query.slug}/columns/${columnId}/taskIds`), ["no tasks"])
                                    }

                                    const tasks = column?.taskIds?.map((taskId) => boardsData.tasks[taskId]);

                                    return <Column key={column.id} column={column} tasks={tasks} />;
                                })
                            }
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}