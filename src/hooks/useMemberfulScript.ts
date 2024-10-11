import { useEffect } from "react";

const useMemberfulScript = (siteUrl: string) => {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://js.memberful.com/embed.js";
  //   script.async = true;
  //   script.onload = () => {
  //     if (window.Memberful) {
  //       (window as any).Memberful.setup({ site: [siteUrl] });
  //     } else {
  //       console.error("Memberful script did not load correctly.");
  //     }
  //   };
  //   script.onerror = () => {
  //     console.error("Failed to load Memberful script.");
  //   };
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, [siteUrl]);
};

export default useMemberfulScript;
