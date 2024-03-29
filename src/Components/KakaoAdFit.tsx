import { useEffect, useRef } from "react";

export default function KakaoAdFit() {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateAd = () => {
      if (!adContainerRef.current) return;

      // 광고 컨테이너 초기화
      adContainerRef.current.innerHTML = "";

      const ins = document.createElement("ins");
      const script = document.createElement("script");

      ins.className = "kakao_ad_area";
      ins.style.display = "block";

      // 윈도우 사이즈에 따라 광고 사이즈 조정
      const windowSize = window.innerWidth;
      if (windowSize >= 1024) {
        ins.setAttribute("data-ad-width", "160");
        ins.setAttribute("data-ad-height", "600");
        ins.setAttribute("data-ad-unit", "DAN-PvkGzjjr2IA1Emar");
      } else if (windowSize > 768) {
        ins.setAttribute("data-ad-width", "728");
        ins.setAttribute("data-ad-height", "90");
        ins.setAttribute("data-ad-unit", "DAN-GiwdXR0gs08Zdbet");
      } else {
        ins.setAttribute("data-ad-width", "250");
        ins.setAttribute("data-ad-height", "250");
        ins.setAttribute("data-ad-unit", "DAN-hCwEiBAHPVpUbRDT");
      }

      script.async = true;
      script.type = "text/javascript";
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";

      adContainerRef.current.appendChild(ins);
      adContainerRef.current.appendChild(script);
    };

    updateAd();

    window.addEventListener("resize", updateAd);

    return () => window.removeEventListener("resize", updateAd);
  }, []);

  return <aside ref={adContainerRef} className="aside__kakaoAdFit"></aside>;
}
