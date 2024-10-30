"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

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

  return (
    <div className="w-full">
      <div className="w-full flex justify-end mb-5">
        <Link
          href="/admin/sectors/marine/add-marine"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Section
        </Link>
      </div>
      {!list?.length && <p className="text-center text-gray-600">No sections found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-3">
        {list &&
          list.length > 0 &&
          list?.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
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
      </div>
    </div>
  );
};

export default MarineSections;
