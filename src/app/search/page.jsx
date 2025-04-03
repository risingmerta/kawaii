import FilterComp from "@/component/FilterComp/FilterComp";
import React from "react";
import "./filterpage.css";
import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

// MongoDB connection detail
export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const idd = "Anime";

  return {
    title: `Watch ${idd} English Sub/Dub online free on ${siteName} , free Anime Streaming`,
    description: `${siteName} is the best site to watch
                      ${idd} SUB online, or you can even
                      watch ${idd} DUB in HD quality. You
                      can also watch under rated anime
                      on ${siteName} website.`,
  };
}
// Main page function
export default async function page({ searchParams }) {
  const searchParam = await searchParams;

  let data;

  const resi = await fetch("https://vimal.animoon.me/api/");
  data = await resi.json();

  const res = await fetch(
    `https://vimal.animoon.me/api/search?keyword=${searchParam.keyword}
   ${`&page=${searchParam.page || "1"}`}${
      searchParam.type ? `&type=${searchParam.type}` : ""
    }${searchParam.status ? `&status=${searchParam.status}` : ""}${
      searchParam.rated ? `&rated=${searchParam.rated}` : ""
    }${searchParam.score ? `&score=${searchParam.score}` : ""}${
      searchParam.season ? `&season=${searchParam.season}` : ""
    }${searchParam.language ? `&language=${searchParam.language}` : ""}${
      searchParam.sy ? `&sy=${searchParam.sy}` : ""
    }${searchParam.sm ? `&sm=${searchParam.sm}` : ""}${
      searchParam.sd ? `&sd=${searchParam.sd}` : ""
    }${searchParam.ey ? `&ey=${searchParam.ey}` : ""}${
      searchParam.em ? `&em=${searchParam.em}` : ""
    }${searchParam.ed ? `&ed=${searchParam.ed}` : ""}${
      searchParam.sort ? `&sort=${searchParam.sort}` : ""
    }${searchParam.genres ? `&genres=${searchParam.genres}` : ""}`
  );
  const filteredAnimes = await res.json();
  console.log(filteredAnimes.results.data);

  return (
    <div className="flirt">
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <FilterComp
        data={data.results}
        filteredAnimes={filteredAnimes}
        type={searchParam.type || ""}
        status={searchParam.status || ""}
        rated={searchParam.rated || ""}
        score={searchParam.score || ""}
        season={searchParam.season || ""}
        language={searchParam.language || ""}
        sy={searchParam.sy || ""}
        sm={searchParam.sm || ""}
        sd={searchParam.sd || ""}
        ey={searchParam.ey || ""}
        em={searchParam.em || ""}
        ed={searchParam.ed || ""}
        sort={searchParam.sort || ""}
        genres={searchParam.genres || ""}
        page={searchParam.page}
        onSear={"yes"}
        totalPages={filteredAnimes.results.totalPage}
        totalDocs={filteredAnimes.results.totalResults}
        keyword={searchParam.keyword || ""}
        collectionName={`Search results for`}
      />
      <Advertize />
    </div>
  );
}
