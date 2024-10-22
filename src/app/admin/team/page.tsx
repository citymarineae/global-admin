"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import Image from "next/image";

interface Member {
  _id: string;
  name: string;
  position: string;
  description: string;
  email: string;
  phone: string;
  image: string;
}

const Team = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/team");
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          console.error("Failed to fetch news");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <AdminPanelLayout currentPage="/admin/team">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">City Marine Teams Page</h1>
          <Link
            href="/admin/team/add-member"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Member
          </Link>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-600">Loading members...</p>
        ) : members.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">No members found.</p>
            <p className="mt-2 text-gray-500">Click &quot;Add New Member&quot; to create your first team member.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-contain"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
                  <p className="text-gray-600 mb-2">{member.position}</p>
                  <Link
                    href={`/admin/team/edit/${member._id}`}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminPanelLayout>
  );
};

export default Team;
