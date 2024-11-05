"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'

type MarineCard = {
  id: string;
  title: string;
  description: string;
  image: string;
};



const MarineSections = () => {
  const [list, setList] = useState<MarineCard[]>();

  const fetchData = async () => {
    const response = await fetch("/api/sectors/marine/section", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!data || data.error) return;
    setList(data.marineSections);
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(list);

  const handleDragEnd = async (result: DropResult) => {
    console.log(result)
    if (list) {
      const items = Array.from(list)
      const [reOrderedItems] = items.splice(result.source.index, 1)
      if (result.destination) {
        items.splice(result.destination.index, 0, reOrderedItems)
      }
      setList(items)
    }
  }

  const [reOrderMode, setReOrderMode] = useState(false)

  const handleConfirm = async () => {

    if (list) {
      const response = await fetch("/api/sectors/marine/section/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(list)
      })

      if (response.ok) {
        alert("Updated list accordingly")
      } else {
        alert("Something went wrong")
      }
    }

    setReOrderMode(false)
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-end mb-5 gap-5">

        <div>
          {!reOrderMode ? <button onClick={() => setReOrderMode(true)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Reorder</button> : <button onClick={handleConfirm} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>}

        </div>

        <Link
          href="/admin/sectors/marine/add-marine"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Section
        </Link>

      </div>


      {!list?.length && <p className="text-center text-gray-600">No sections found.</p>}

      {!reOrderMode ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-3">

        {list?.map((item) => (

          <div className="bg-white shadow-md rounded-lg overflow-hidden" key={item.id}>
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={200}
              className="w-full object-contain"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <Link
                href={`/admin/sectors/marine/edit/${item.id}`}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </Link>
            </div>
          </div>

        ))}

      </div>) : (

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="p-4 w-full">
            <Droppable droppableId="sectorsDroppable">
              {(provided) => (
                <ul className="bg-white rounded-lg shadow divide-y divide-gray-200 w-full" {...provided.droppableProps} ref={provided.innerRef}>
                  {list?.map((item, index) => (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(provided) => (
                        <li className="px-6 py-4" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                          <div className="flex justify-between">
                            <div className="flex justify-between items-center gap-4">
                              <div>
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={70}
                                  height={50}
                                  className="w-full object-contain"
                                />
                              </div>
                              <span className="font-semibold text-lg">{item.title}</span>
                            </div>

                          </div>
                          {/* <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p> */}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}

            </Droppable>
          </div>
        </DragDropContext>

      )

      }



    </div>
  );
};

export default MarineSections;
