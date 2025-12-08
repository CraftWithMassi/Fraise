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

const sections = [
  {
    verse: "Quand le soleil se lève, c'est ton visage qui illumine mes premières pensées. 🌅",
    imgPosition: "left",
    image: img1,
  },
  {
    verse: "Ton rire réchauffe mes silences comme un feu dans l'hiver. 💭",
    imgPosition: "right",
    image: img2,
  },
  {
    verse: "Même à des kilomètres, tu es la seule présence qui ne me quitte jamais. ✈️",
    imgPosition: "left",
    image: img3,
  },
  {
    verse: "Chaque battement de mon cœur répète ton nom comme une prière silencieuse. 🌙",
    imgPosition: "right",
    image: img4,
  },
  {
    verse: "Ce vide que tu combles, c'est la preuve que ce qu'on vit dépasse la distance. 💖",
    imgPosition: "left",
    image: img5,
  },
];

const CombinedSection = () => {
  const audioRef = useRef(null);
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    const storedIpAddress = localStorage.getItem('ipAddress');
    if (storedIpAddress) {
      setIpAddress(storedIpAddress);
    }
  }, []);

  const getUserInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cookiesEnabled = navigator.cookieEnabled;
    const doNotTrack = navigator.doNotTrack;
    const referrer = document.referrer;
    const currentUrl = window.location.href;

    return {
      userAgent,
      platform,
      language,
      screenResolution: `${screenWidth}x${screenHeight}`,
      colorDepth,
      timezone,
      cookiesEnabled,
      doNotTrack,
      referrer,
      currentUrl
    };
  };

  const fetchIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const newIpAddress = data.ip;
      setIpAddress(newIpAddress);
      localStorage.setItem('ipAddress', newIpAddress);
      await sendIPAddressToGoogleSheet(newIpAddress);
    } catch (error) {
      console.error('Error fetching IP address:', error);
    }
  };

  const sendIPAddressToGoogleSheet = async (ipAddress) => {
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxUiSgtG7PdLkalNA7_4vi_rxo0jlTGB8jRF2L35cbQziybIGEwa9DmigKzH4kOASHpmg/exec';
      
      const userInfo = getUserInfo();
      const formData = new FormData();
      formData.append('ipAddress', ipAddress);
      formData.append('timestamp', new Date().toISOString());
      formData.append('userAgent', userInfo.userAgent);
      formData.append('platform', userInfo.platform);
      formData.append('language', userInfo.language);
      formData.append('screenResolution', userInfo.screenResolution);
      formData.append('colorDepth', userInfo.colorDepth);
      formData.append('timezone', userInfo.timezone);
      formData.append('cookiesEnabled', userInfo.cookiesEnabled);
      formData.append('doNotTrack', userInfo.doNotTrack);
      formData.append('referrer', userInfo.referrer);
      formData.append('currentUrl', userInfo.currentUrl);

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('User information saved to Google Sheet!');
      } else {
        throw new Error('Failed to save to Google Sheet');
      }
    } catch (error) {
      console.error('Error saving user information to Google Sheet:', error);
    }
  };

  const handlePlay = async () => {
    try {
      await audioRef.current.play();
      audioRef.current.muted = false; // Unmute the audio
      await sendIPAddressToGoogleSheet(ipAddress);
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  };

  return (
    <div className="w-full h-screen overflow-x-hidden overflow-y-scroll snap-y snap-mandatory bg-white scroll-smooth">
      {/* Background Music */}
      <audio ref={audioRef} loop muted src={music} className="hidden" />

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

      {/* Landing Section */}
      <section className="min-h-screen snap-start flex items-center justify-center bg-soft-pink px-4 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-pink-700 mb-4">
            Je voulais t'offrir un cadeau...
          </h1>
          <p className="text-base md:text-lg text-pink-600 leading-relaxed mx-auto">
            ...mais pas comme les autres. Ce n'est pas un message comme les autres, c'est un voyage.
            Scroll doucement. Chaque geste compte.
          </p>
        </motion.div>
      </section>

      {/* Poem Section */}
      {sections.map((sec, i) => (
        <motion.section
          key={i}
          className="relative min-h-screen snap-start flex flex-col items-center justify-center px-4 w-full"
        >
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
                className={`w-48 md:w-64 h-auto rounded-xl shadow-xl ${sec.imgPosition === "left" ? "-rotate-[5deg]" : "rotate-[5deg]"}`}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.p
              className={`text-lg md:text-2xl text-gray-800 font-semibold leading-snug italic ${sec.imgPosition === "left" ? "text-right" : "text-left"}`}
              initial={{ x: sec.imgPosition === "left" ? 100 : -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              « {sec.verse} »
            </motion.p>
          </div>
        </motion.section>
      ))}

      {/* Final Section */}
      <motion.section className="relative min-h-screen snap-start flex flex-col items-center justify-center px-4 bg-white w-full">
        <p className="text-xl md:text-2xl text-center text-gray-700 font-semibold mb-6">
          Je ne rêve pas d'une vie parfaite, juste d'une vie avec toi, jusqu'au dernier chapitre. 💌
        </p>
        <img src={handsHolding} alt="Hands holding" className="w-56 md:w-72 h-auto object-contain" />
      </motion.section>

      {/* Footer Section */}
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