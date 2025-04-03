import React from "react";
import RecommendedTopTen from "../../layouts/RecommendedTopTen";
import Advertize from "@/component/Advertize/Advertize";
import Script from "next/script";

export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing

  const param = await params;
  const idToCheck = param.anime;

  let datao = "";

  try {
    const res = await fetch(
      `https://vimal.animoon.me/api/info?id=${idToCheck}`
    );
    const dat = await res.json();
    datao = dat;
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  }

  const title = datao?.results?.data?.title;

  return {
    title: `Watch ${title} English Sub/Dub online free on ${siteName}`,
    description: `${siteName} is the best site to watch ${title} SUB online, or you can even watch ${title} DUB in HD quality. You can also watch underrated anime on ${siteName}.`,
  };
}

export default async function Page({ params }) {
  const param = await params;
  const idToCheck = param.anime;

  let data;
  let existingAnime = [];

  try {
    const res = await fetch(
      `https://vimal.animoon.me/api/info?id=${idToCheck}`
    );
    const dat = await res.json();
    existingAnime = dat;

    const resi = await fetch("https://vimal.animoon.me/api/");
    data = await resi.json();
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  }

  // Fetch the anime details

  const ShareUrl = `https://animoon.me/${idToCheck}`;
  const arise = "this Anime";

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <RecommendedTopTen
        uiui={existingAnime}
        data={data.results}
        ShareUrl={ShareUrl}
        arise={arise}
        id={idToCheck}
      />
      <Advertize />
    </div>
  );
}
