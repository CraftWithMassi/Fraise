import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import Burst from "./burst";
import flower from "../assets/flower.png";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import handsHolding from "../assets/handsHolding.JPG";
import footerImg from "../assets/footerImg.JPG";
import music from "../assets/music.mp3";
import Snowfall from 'react-snowfall';

const sections = [
  { verse: "Quand le soleil se lève, ton visage éclaire mes premières pensées 🌅", imgPosition: "left", image: img1 },
  { verse: "Ton rire réchauffe mes silences, tel un feu dans l'hiver 💭", imgPosition: "right", image: img2 },
  { verse: "Même à des kilomètres, tu restes la seule présence qui ne me quitte jamais ✈️", imgPosition: "left", image: img3 },
  { verse: "Chaque battement de mon cœur murmure ton nom, comme une prière silencieuse 🌙", imgPosition: "right", image: img4 },
  { verse: "Le vide que tu combles nous rappelle que notre amour transcende la distance 💖", imgPosition: "left", image: img5 },
];

const CombinedSection = () => {
  const audioRef = useRef(null);
  const [ipAddress, setIpAddress] = useState('');

  // Fetch IP address eagerly on mount
  useEffect(() => {
    const initIp = async () => {
      const storedIp = localStorage.getItem('ipAddress');
      if (storedIp) {
        setIpAddress(storedIp);
      } else {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          setIpAddress(data.ip);
          localStorage.setItem('ipAddress', data.ip);
        } catch (err) {
          console.error("IP Fetch Error:", err);
        }
      }
    };
    initIp();
  }, []);

  const getUserInfo = () => ({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    referrer: document.referrer,
    currentUrl: window.location.href,
  });

  const sendIPAddressToGoogleSheet = async (ipToLog) => {
    try {
      const scriptURL ='https://script.google.com/macros/s/AKfycbx6sGZfei74DueUiNyHnypEsW0fuQbUeV60qzx4jfpEqzEzxEp5chB7kJjs5hIBeqN4Hg/exechttps://script.google.com/macros/s/AKfycbx6sGZfei74DueUiNyHnypEsW0fuQbUeV60qzx4jfpEqzEzxEp5chB7kJjs5hIBeqN4Hg/execs';
      const userInfo = getUserInfo();

      const params = new URLSearchParams({
        ipAddress: ipToLog || 'Unknown',
        timestamp: new Date().toISOString(),
        userAgent: userInfo.userAgent,
        platform: userInfo.platform,
        language: userInfo.language,
        screenResolution: userInfo.screenResolution,
        colorDepth: userInfo.colorDepth,
        timezone: userInfo.timezone,
        cookiesEnabled: userInfo.cookiesEnabled,
        doNotTrack: userInfo.doNotTrack,
        referrer: userInfo.referrer,
        currentUrl: userInfo.currentUrl,
      });

      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      console.log('User payload posted successfully.');
    } catch (error) {
      console.error('Failed to log user information:', error);
    }
  };

  const handlePlay = async () => {
    try {
      console.log(ipAddress);
      await audioRef.current.play();
      audioRef.current.muted = false; // Unmute the audio
      await sendIPAddressToGoogleSheet(ipAddress);
      if (audioRef.current) {
        audioRef.current.muted = false;
        await audioRef.current.play();
      }

      let currentIp = ipAddress;
      if (!currentIp) {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        currentIp = data.ip;
        setIpAddress(currentIp);
      }

      await sendIPAddressToGoogleSheet(currentIp);
    } catch (error) {
      console.error("Audio playback/logging error:", error);
    }
  };

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-scroll snap-y snap-mandatory bg-white scroll-smooth">
      <audio ref={audioRef} loop muted src={music} className="hidden" />
      
      <Snowfall
        snowflakeCount={50}
        color="#f9a8d4"
        speed={[0.3, 0.8]}
        wind={[-0.2, 0.2]}
        radius={[1.5, 3]}
        style={{ position: "fixed", width: "100vw", height: "100vh", zIndex: 20 }}
      />

      {/* Hero Section */}
      <section className="min-h-screen snap-start flex flex-col items-center justify-center px-4 w-full">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.div
            className="text-center md:text-left space-y-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-2xl md:text-4xl font-bold text-rose-600 leading-tight">
              « Je t'écris autrement »
            </h1>
            <button
              onClick={handlePlay}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded transition duration-200 ease-in-out hover:bg-rose-500 active:bg-rose-400"
            >
              Click moi avant de scroller
            </button>
          </motion.div>

          <motion.img
            src={flower}
            alt="Fleur"
            className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        </div>
      </section>

      {/* Verses Sections */}
      {sections.map((sec, i) => (
        <motion.section key={i} className="relative min-h-screen snap-start flex flex-col items-center justify-center px-4 w-full">
          <Burst side={sec.imgPosition} />
          <div className="w-full space-y-6">
            <motion.div
              className={`flex ${sec.imgPosition === "left" ? "justify-start" : "justify-end"}`}
              initial={{ x: sec.imgPosition === "left" ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.img
                src={sec.image}
                alt=""
                className={`z-30 w-48 md:w-64 h-auto rounded-xl shadow-xl ${sec.imgPosition === "left" ? "-rotate-[5deg]" : "rotate-[5deg]"}`}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.p className={`text-lg md:text-2xl text-gray-800 font-semibold leading-snug italic ${sec.imgPosition === "left" ? "text-right" : "text-left"}`}>
              « {sec.verse} »
            </motion.p>
          </div>
        </motion.section>
      ))}

      {/* Footer Section */}
      <motion.section className="relative min-h-screen snap-start flex flex-col items-center justify-center px-4 bg-white w-full">
        <p className="text-xl md:text-2xl text-center text-gray-700 font-semibold mb-6">
          Je ne rêve pas d'une vie parfaite, juste d'une vie avec toi, jusqu'au dernier chapitre. 💌
        </p>
        <img src={handsHolding} alt="Hands holding" className="w-56 md:w-72 h-auto object-contain" />
      </motion.section>

      <motion.section
        className="relative min-h-screen snap-start flex items-center justify-center bg-cover bg-center w-full"
        style={{ backgroundImage: `url(${footerImg})` }}
      >
        <h2 className="pretty text-white text-3xl md:text-4xl font-bold italic drop-shadow-md">
          Je t'aime Lina ❤️
        </h2>
      </motion.section>
    </div>
  );
};

export default CombinedSection;
