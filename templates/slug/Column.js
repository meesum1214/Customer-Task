
import React from "react";

const Column = ({ column, tasks }) => {

    return (
        <div className="rounded-sm bg-[#16181D] flex flex-col mr-6 w-64 ">

            <div className="flex justify-between items-center w-full px-6 h-[60px] bg-[#242731] rounded-sm rounded-b-none">
                <div className="text-[17px] font-bold text-subtle-text">
                    {column.title}
                </div>
            </div>

            <div className="px-[1.5rem] flex-1 flex-col pt-6">
                {
                    tasks?.map((task, index) => (
                        <div key={task.id}>
                            <div className={`mb-[1rem] bg-[#242731] rounded-[3px] p-[1.5rem]`}>
                                <div className="w-full flex justify-between">
                                    <div className="w-[95%]">{task.content}</div>
                                </div>
                                {
                                    task.img !== "No Image" && <img
                                        src={task.img}
                                        alt={task.img}
                                        className="w-[100%] rounded-sm mt-2"
                                    />
                                }
                                <div className="mt-2">Price: <span className="text-green-500">${task.price}</span></div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Column;
