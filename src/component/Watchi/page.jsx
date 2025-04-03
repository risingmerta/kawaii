"use client";
import React from "react";
import WatchAnime from "../WatchAnime/WatchAnime";

const Watchi = (props) => {
  return (
    <div>
      <WatchAnime
        data={props.data}
        anId={props.anId}
        subPrio={props.subPrio}
        dataStr={props.dataStr}
        datajDub={props.datajDub}
        datajSub={props.datajSub}
        datao={props.datao}
        epiod={props.epiod}
        epId={props.epId}
        epis={props.epis}
        dataj={props.dataj}
        datapp={props.datapp}
        gogoDub={props.gogoDub}
        gogoSub={props.gogoSub}
        ShareUrl={props.ShareUrl}
        arise={props.arise}
        raw={props.raw}
      />
    </div>
  );
};

export default Watchi;
