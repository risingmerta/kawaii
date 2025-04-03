import Advertize from "@/component/Advertize/Advertize";
import GenreSidebar from "@/component/Gridle/page";
import { MongoClient } from "mongodb";
import Script from "next/script";
import React from "react";

export async function generateMetadata({ searchParams }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const searchParam = await searchParams;
  const idd = searchParam.name || "Anime"; // Default fallback for name

  return {
    title: `Watch ${idd} Anime English Sub/Dub online free on ${siteName}`,
    description: `${siteName} is the best site to watch ${idd} Anime SUB online, or you can even watch ${idd} Anime DUB in HD quality. You can also watch underrated anime on ${siteName} website.`,
  };
}

export default async function page({ searchParams }) {
  const searchParam = await searchParams;
  const cate = searchParam.name?.toString() || "default-category"; // Ensure cate has a value
  const date = cate
    .replaceAll(" ", "-")
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9\-]/g, ""); // Clean up the category name for URL

  const pageParam = searchParam.page ? searchParam.page : "1";

  const [animeResp, homeResp] = await Promise.all([
    fetch(`https://vimal.animoon.me/api/genre/${date}?page=${pageParam}`, {
      next: { revalidate: 3600 },
    }),
    fetch("https://vimal.animoon.me/api", {
      next: { revalidate: 3600 },
    }),
  ]);

  if (!animeResp.ok || !homeResp.ok) {
    throw new Error("Failed to fetch data.");
  }

  const data = await animeResp.json();
  const datal = await homeResp.json();

  // Fetch genre-specific anime list and homepage data concurrently
  // Constructing the shareable URL
  const ShareUrl = `https://animoon.me/genre?id=${cate}&name=${cate}`;
  const arise = `${cate} Anime`;

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <GenreSidebar
        data={data.results}
        name={cate}
        cate={cate}
        datal={datal.results}
        totalPages={data.results.totalPages}
        genre={"yes"}
        ShareUrl={ShareUrl}
        page={pageParam}
        arise={arise}
      />
      <Advertize />
    </div>
  );
}
