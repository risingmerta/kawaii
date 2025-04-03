import Advertize from "@/component/Advertize/Advertize";
import Home from "@/component/Home/Home";
import Script from "next/script";

export default async function Page() {
  let data = []; // Default empty array to prevent errors

  try {
    // Fetch data from the API
    const res = await fetch(`https://vimal.animoon.me/api/`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch data");

    data = await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="//disgustingmad.com/a5/d2/60/a5d260a809e0ec23b08c279ab693d778.js"
      />
      <Home data={data} />
      <Advertize />
    </div>
  );
}
