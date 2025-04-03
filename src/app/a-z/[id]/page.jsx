import SearchResults from "@/component/AZ/az";
import Script from "next/script";
import React from "react";

export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const idd = "Anime";

  return {
    title: `Watch ${idd} English Sub/Dub online free on ${siteName}, free Anime Streaming`,
    description: `${siteName} is the best site to watch
                    ${idd} SUB online, or you can even
                    watch ${idd} DUB in HD quality. You
                    can also watch underrated anime
                    on ${siteName} website.`,
  };
}

export default async function page({ params, searchParams }) {
  const param = await params;
  const searchParam = await searchParams;
  let json = "";

  try {
    const url = searchParam.sort
      ? `https://vimal.animoon.me/api/az-list/${searchParam.sort}?page=${
          searchParam.page || "1"
        }`
      : `https://vimal.animoon.me/api/az-list?page=${searchParam.page || "1"}`;

    const data = await fetch(url, {
      cache: "force-cache",
      headers: {
        "Cache-Control": `public, max-age=${cacheMaxAge}, stale-while-revalidate=${cacheMaxAge}`,
      },
    });

    json = await data.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <SearchResults
        el={json}
        sort={searchParam.sort}
        page={searchParam.page}
        totalPages={count}
        para={param.id}
      />
    </div>
  );
}
