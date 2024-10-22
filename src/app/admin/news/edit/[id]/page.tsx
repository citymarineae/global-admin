"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddNewsPage from "../../add-news/page";

const EditNewsPage = () => {
  const { id } = useParams();
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`/api/news?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setNewsData(data);
        } else {
          console.error("Failed to fetch news data");
        }
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    if (id) {
      fetchNewsData();
    }
  }, [id]);

  if (!newsData) {
    return <div>Loading...</div>;
  }

  return <AddNewsPage initialData={newsData} isEditing={true} />;
};

export default EditNewsPage;
