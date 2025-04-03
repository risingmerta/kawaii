import React from "react";
// import WatchAnime from "../../../component/WatchAnime/WatchAnime";
// import axios from "axios";
// import * as cheerio from "cheerio";
import { MongoClient, ObjectId } from "mongodb";
import Watchi from "@/component/Watchi/page";
import Script from "next/script";
// import { currentUser } from "@clerk/nextjs/server";

async function fetchDataFromAPI(url, revalidate) {
  try {
    const response = await fetch(url, {
      cache: "force-cache", // Cache the response forcefully
      next: { revalidate },
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from API: `, error);
    return null;
  }
}

// Generate metadata dynamically based on the anime info
export async function generateMetadata({ params }) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Animoon"; // Default if env is missing
  const param = await params;
  try {
    const idToCheck = param.id;

    let datao = "";

    const res = await fetch(
      `https://vimal.animoon.me/api/info?id=${idToCheck}`
    );
    const dat = await res.json();
    datao = dat;

    const title = datao?.results?.data?.title;

    return {
      title: `Watch ${title} English Sub/Dub online free on ${siteName}`,
      description: `${siteName} is the best site to watch ${title} SUB online, or you can even watch underrated anime on ${siteName}.`,
    };
  } catch (error) {
    console.error("Error fetching metadata: ", error);
    return {
      title: `Watch Anime Online Free on ${siteName}`,
      description: `${siteName} is the best site to watch anime in high quality with both sub and dub options.`,
    };
  }
}

// Main page component
export default async function page({ params, searchParams }) {
  const searchParam = await searchParams;
  const epis = searchParam.ep;
  const param = await params;
  const episodeIdParam = epis ? `${param.id}?ep=${epis}` : null;

  const idToCheck = param.id;

  let datao;
  let data;

  const res = await fetch(`https://vimal.animoon.me/api/info?id=${idToCheck}`);
  const dat = await res.json();
  datao = dat;

  const rest = await fetch(
    `https://vimal.animoon.me/api/episodes/${idToCheck}`
  );
  const episo = await rest.json();
  data = episo;

  // Determine the episode ID
  const epId = episodeIdParam || data?.results?.episodes[0]?.id;

  // Find the episode number
  let episodeNumber = 0;
  if (data?.results?.episodes?.length > 0) {
    const currentEpisode = data?.results?.episodes?.find(
      (ep) => ep?.id === epId
    );
    episodeNumber = currentEpisode ? currentEpisode?.episode_no : 0;
  }

  let epiod = 0;
  let i = 0;
  for (i > 0; i < data?.results?.episodes?.length; i++) {
    if (data?.results?.episodes[i]?.id?.includes(epId)) {
      epiod = data?.results?.episodes[i]?.episode_no;
    }
  }

  epiod = episodeNumber;

  let dubTruth = "";

  if (datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod) {
    dubTruth = "yes";
  }

  let datajDub = [];
  let datajSub = [];
  let raw = "";

  if (datao?.results?.data?.animeInfo?.tvInfo?.dub >= epiod) {
    if (!datajDub?.results?.streamingLink?.link?.file) {
      const res = await fetch(`https://vimal.animoon.me/api/servers/${epId}`);
      const dat = await res.json();
      if (dat.results.some((item) => item.type === "dub")) {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=dub`
        );
        const strdat = await res.json();

        datajDub = strdat;
      }
    }
  }

  if (datao?.results?.data?.animeInfo?.tvInfo?.sub >= epiod) {
    if (!datajSub?.results?.streamingLink?.link?.file) {
      const res = await fetch(`https://vimal.animoon.me/api/servers/${epId}`);
      const dat = await res.json();
      if (dat.results.some((item) => item.type === "sub")) {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=sub`
        );
        const strdat = await res.json();

        datajSub = strdat;
      }

      if (dat.results.some((item) => item.type === "raw")) {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=raw`
        );
        const strdat = await res.json();

        datajSub = strdat;
      }
    }
  }

  if (datao.results.data.animeInfo.Status === "Currently-Airing") {
    const res = await fetch(`https://vimal.animoon.me/api/servers/${epId}`, {
      next: { revalidate: 3600 },
    });
    const dat = await res.json();
    if (dat.results.some((item) => item.server_id === "1")) {
      if (
        dat.results.some(
          (item) =>
            item.type === "dub" &&
            datajDub?.results?.streamingLink?.intro?.end === 0 &&
            datajDub?.results?.streamingLink?.outro?.start === 0
        )
      ) {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=dub`
        );
        const strdat = await res.json();

        datajDub = strdat;
      }
      if (
        dat.results.some(
          (item) =>
            item.type === "sub" &&
            datajSub?.results?.streamingLink?.intro?.end === 0 &&
            datajSub?.results?.streamingLink?.outro?.start === 0
        )
      ) {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=sub`
        );
        const strdat = await res.json();

        datajSub = strdat;
      }

      if (
        dat.results.some(
          (item) =>
            item.type === "raw" &&
            datajSub?.results?.streamingLink?.intro?.end === 0 &&
            datajSub?.results?.streamingLink?.outro?.start === 0
        )
      ) {
        const res = await fetch(
          `https://vimal.animoon.me/api/stream?id=${epId}&server=hd-2&type=raw`
        );
        const strdat = await res.json();

        datajSub = strdat;
      }

      if (
        datajSub?.results?.streamingLink?.intro?.end === 0 &&
        datajSub?.results?.streamingLink?.outro?.start === 0
      ) {
        const resp = await fetch(
          `https://vimal.animoon.me/api/episodes/${param.id}`
        );
        const datar = await resp.json();
        data = datar;
      }
    }
  }

  if (!datao?.results?.data?.title) {
    const resp = await fetch(
      `https://vimal.animoon.me/api/info?id=${param.id}`
    );
    const datar = await resp.json();
    datao = datar;
  }

  if (Array.isArray(data?.results)) {
    const resp = await fetch(
      `https://vimal.animoon.me/api/episodes/${param.id}`
    );
    const datar = await resp.json();
    data = datar;
  }

  if (data?.results?.episodes?.length > 0) {
    const currentEpisode = data?.results?.episodes?.find(
      (ep) => ep?.id === epId
    );
    episodeNumber = currentEpisode ? currentEpisode?.episode_no : 0;
  }

  const dataStr = { sub: [], dub: [] };

  let gogoSub = [];
  let gogoDub = [];
  let subPri = [];
  if (!subPri || subPri.length === 0) {
  }

  const subPrio = subPri && subPri.tracks ? subPri.tracks : "";

  let datapp;

  try {
    // Connect to MongoDB
    const res = await fetch("https://vimal.animoon.me/api/");
    datapp = await res.json();
  } catch (error) {
    console.error("Error fetching data from MongoDB or API:", error.message);
  }

  // Share URL and title for the current episode
  const ShareUrl = `https://animoon.me/watch/${epId}`;
  const arise = "this Episode";

  let dataj = [];

  // Render WatchAnime component
  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <Watchi
        data={data}
        anId={param.id}
        subPrio={subPrio}
        dataStr={dataStr}
        datajDub={datajDub}
        datajSub={datajSub}
        datao={datao}
        epiod={episodeNumber}
        epId={epId}
        epis={epis}
        dataj={dataj}
        datapp={datapp.results}
        gogoDub={gogoDub}
        gogoSub={gogoSub}
        ShareUrl={ShareUrl}
        arise={arise}
        raw={raw}
      />
    </div>
  );
}
