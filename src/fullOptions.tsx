import React, { useEffect, useState, useRef } from "react";
import Button from "./components/Button";
import logo from "./assets/images/dbe_logo.png";
import coffee from "./assets/images/coffee.png";
import yugiIcon from "./assets/images/yugi-icon.png";
import { BsDiscord } from 'react-icons/bs'
import {BiCoffeeTogo} from 'react-icons/bi'
import ReactDOM from "react-dom";

export const Options = () => {
  const [color, setColor] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [like, setLike] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSmall, setIsSmall] = useState(false);
  const [currentSection, setCurrentSection] = useState("General");

// conditional stuff for changing DuelingBookEnhanced to DBE based on ref div's width
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 260) {
          setIsSmall(true);
        } else {
          setIsSmall(false);
        }
      }
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSectionClick = (section: string) => {
    setCurrentSection(section);
  }

  useEffect(() => {
    chrome.storage.sync.get(
      {
        favoriteColor: "red",
        likesColor: true,
      },
      (items) => {
        setColor(items.favoriteColor);
        setLike(items.likesColor);
      }
    );
  }, []);

  const saveOptions = () => {
    chrome.storage.sync.set(
      {
        favoriteColor: color,
        likesColor: like,
      },
      () => {
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case "General":
        return <div>General Settings Here</div>;
      case "Customize Hotkeys":
        return <div>Customize Hotkeys Here</div>;
      case "Advanced":
        return <div>Advanced Settings Here</div>;
      case "Help":
        return <div>Help Content Here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto flex items-stretch h-auto p-4">
      <div className="flex flex-col bg-gray-300 rounded-lg shadow-lg mb-8">
        <div ref={containerRef} className="flex items-center mb-4 bg-gray-700 justify-center">
          <img src={logo} alt="DBE Logo" className="w-16 h-16" />
          <h2 className="text-2xl font-bold text-white">
          {isSmall ? "DB" : "DuelingBook"}
            <span className="text-gray-500">
              {isSmall ? "E" : 'Enhanced'}
            </span>
          </h2>
        </div>
        <p className="text-xl font-semibold text-center">SETTINGS</p>
        <nav className="mt-4">
          <button className="bg-gray-700 w-full py-2 mb-2">General</button>
          <button className="bg-gray-700 w-full py-2 mb-2">Customize Hotkeys</button>
          <button className="bg-gray-700 w-full py-2 mb-2">Advanced</button>
          <button className="bg-gray-700 w-full py-2 mb-2">Help</button>
        </nav>
      </div>
      <div className="flex-grow p-4 pt-0 rounded-lg">
        <aside className="bg-gray-700 text-white p-4 mb-4 rounded-lg flex justify-center items-center align-middle text-lg space-x-4">
          <div className="flex items-center ">
            <img src={yugiIcon} alt="yugi icon" className="w-10 h-10 justify-center mb-2" />
          </div>
          <p className="">
            Join our Discord!
          </p>
          <button className="bg-blue-500 p-2 font-bold flex justify-center items-center"><BsDiscord className="w-8 h-8 flex" /></button>
        </aside>

        <main>

          <h1 className="text-3xl font-bold">General</h1>
          <p className="text-gray-600 mt-2 mb-4">Determine how DuelingBookEnhanced can improve your experience</p>
          <hr className="border-gray-300 mb-4" />
          <div className="space-y-4">
            <label className="flex items-center"><input type="checkbox" className="mr-2" />Enable DuelingBookEnhanced</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" />Skip Intro</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" />Auto-Connect (must be logged in!)</label>
            <label className="flex items-center"><input type="checkbox" className="mr-2" />Night Mode</label>
          </div>
          <hr className="border-gray-300 my-4" />
          <div className="flex justify-evenly items-center">
            <div className="flex items-center">
              <span className="mr-2">Noticed a bug or want to request a feature? Let us know!</span>
              <Button buttonText="Bugs & Feedback" buttonUrl="https://forms.gle/yLW8pasvEr2rshSQ9" />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Ready to play? It's time to duel!</span>
              <Button buttonText="Open DB" buttonUrl="http://www.DuelingBook.com/html5" />
            </div>
          </div>
        </main>

        <footer className="pt-2">
          <div className="bg-gray-700 text-white p-4 mb-4 rounded-lg flex justify-center items-center align-middle text-lg space-x-4 flex-grow">
            <img src={coffee} alt="coffee" className="w-8 h-8" />
            <div className="">
              <span className="font-bold">Enjoying our Product?</span>
              <span> Share some support</span>
            </div>
            <button className="bg-blue-500 p-2 font-bold flex justify-center items-center"><BiCoffeeTogo className="w-8 h-8 flex" /></button>
          </div>
        </footer>
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root')
);