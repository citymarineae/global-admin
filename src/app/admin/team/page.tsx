"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import Image from "next/image";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import { toast } from "sonner";
import 'sweetalert2/src/sweetalert2.scss'

interface Member {
  id: string;
  name: string;
  position: string;
  description: string;
  email: string;
  phone: string;
  image: string;
  index:number
}

const Team = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reOrderMode,setReOrderMode] = useState(false)
  const [refetch,setRefetch] = useState(false)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/team");
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [refetch]);

  const handleDragEnd = (result:DropResult) =>{
    if (members) {
      const items = Array.from(members)
      const [reOrderedItems] = items.splice(result.source.index, 1)
      if (result.destination) {
        items.splice(result.destination.index, 0, reOrderedItems)
      }
      
      const updatedItems = items.map((item, index) => ({
        ...item,         // Retain the existing properties of the item
        index: index + 1,  // Assign position starting from 1
      }));

      setMembers(updatedItems)
    }
  }

  const handleConfirm = async() =>{
    if (members) {
      const response = await fetch("/api/team/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(members)
      })

      if (response.ok) {
        alert("Updated list accordingly")
      } else {
        alert("Something went wrong")
      }
    }

    setReOrderMode(false)
  }

  const handleDelete = async(itemId:string) =>{
    
    Swal.fire({
      title: "Are you sure about this?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/team?id=${itemId}`,{
            method:"DELETE"
          })
          
          if(response.ok){
            const data = await response.json()
            toast.success(data.message)
            setRefetch((prev)=>!prev)
          }else{
            const data = await response.json()
            toast.error(data.error)
          }
    
        } catch (error) {
          console.log("Error deleting marine section:",error)
        }
      } else if (result.isDenied) {
        toast.error("Changes were not saved")
      }
    });
    
  }
  


  return (
    <AdminPanelLayout currentPage="/admin/team">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">City Marine Teams Page</h1>
          <div className="flex justify-between gap-5">
          
          <div>
          {!reOrderMode ? <button onClick={() => setReOrderMode(true)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Reorder</button> : <button onClick={handleConfirm} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Confirm</button>}

        </div>

          <Link
            href="/admin/team/add-member"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Member
          </Link>
          </div>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-600">Loading members...</p>
        ) : members.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No members found.</p>
            <p className="mt-2 text-gray-500">Click &quot;Add New Member&quot; to create your first team member.</p>
          </div>
        ) : (
          !reOrderMode ? ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={200}
                  className="w-full object-contain"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
                  <p className="text-gray-600 mb-2">{member.position}</p>
                  <div className="flex gap-2">
                  <Link
                    href={`/admin/team/edit/${member.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Edit
                  </Link>
                  <Link href={'#'} onClick={()=>handleDelete(member.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                  >
                    Delete
                  </Link>
                  </div>
                  
                </div>
              </div>
            ))}
          </div> ) :(
            <DragDropContext onDragEnd={handleDragEnd}>
            <div className="p-4 w-full">
              <Droppable droppableId="sectorsDroppable">
                {(provided) => (
                  <ul className="bg-white rounded-lg shadow divide-y divide-gray-200 w-full" {...provided.droppableProps} ref={provided.innerRef}>
                    {members?.map((item, index) => (
                      <Draggable draggableId={item.id} index={index} key={item.id}>
                        {(provided) => (
                          <li className="px-6 py-4" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                            <div className="flex justify-between">
                              <div className="flex justify-between items-center gap-4">
                                <div>
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={70}
                                    height={50}
                                    className="w-full object-contain"
                                  />
                                </div>
                                <span className="font-semibold text-lg">{item.name}</span>
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
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default Team;
