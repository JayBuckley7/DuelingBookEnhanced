import React, { useEffect, useState, useRef } from "react";
import Button from "./components/Button";
import logo from "./assets/images/dbe_logo.png";
import coffee from "./assets/images/coffee.png";
import yugiIcon from "./assets/images/yugi-icon.png";
import { BsDiscord } from 'react-icons/bs'
import { BiCoffeeTogo } from 'react-icons/bi'
import { getOptionsFromStorage, saveOptionsToStorage, OptionsTypes } from './utilities/optionsUtility'
import ReactDOM from "react-dom";
import CustomizeHotkeys from "./customizeHotkeys";
import KnownIssues from "./knownIssues";
import ComingSoon from "./components/ComingSoon";
import { ReloadWarning } from "./components/ReloadWarning";

export const Options = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSmall, setIsSmall] = useState(false);
  const [currentSection, setCurrentSection] = useState("General");
  const [isSavedVisible, setIsSavedVisible] = useState(false);
  const [options, setOptions] = useState<OptionsTypes>({
    disableAllOptions: false,
    skipIntro: false,
    autoConnect: false,
    isNightMode: false,
  });

  // load options from storage when the popup is opened
  useEffect(() => {
    getOptionsFromStorage((savedOptions) => {
      setOptions(savedOptions);
    });
  }, []);

  // save options whenever they change
  useEffect(() => {
    saveOptionsToStorage(options)
  }, [options]);

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

  const settingsSavedMessageTimer = useRef<NodeJS.Timeout | null>(null);

  const toggleSavedMessage = () => {

    setIsSavedVisible(false);
    if (settingsSavedMessageTimer.current) clearTimeout(settingsSavedMessageTimer.current);

    settingsSavedMessageTimer.current = setTimeout(() => {
      setIsSavedVisible(true);
    }, 1);
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case "General":
        return (
          <>
            <h1 className="text-3xl font-bold">General</h1>
            <p className="text-gray-600 mt-2">Determine how DuelingBookEnhanced can improve your experience</p>
            <ReloadWarning />
            <hr className="border-gray-300 mb-4" />
            <div className="flex flex-col gap-4">
              {inputItems.map((item, index) => (
                <div
                  className={`flex items-center ${options.disableAllOptions && index > 0 ? 'opacity-50' : ''}`}
                  key={item.id}
                >
                  <input
                    id={item.id}
                    type="checkbox"
                    className={`mr-2 ${index > 0 && options.disableAllOptions ? '' : 'cursor-pointer'}`}
                    checked={item.checked}
                    onChange={() => {
                      item.onChange();
                      toggleSavedMessage();
                    }}
                    disabled={index > 0 && options.disableAllOptions}
                  />
                  <label className={`flex items-center w-max ${index > 0 && options.disableAllOptions ? '' : 'cursor-pointer'}`} htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
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
          </>
        )
      case "Customize Hotkeys":
        return <CustomizeHotkeys toggleSavedMessage={toggleSavedMessage} />
      case "Advanced":
        return <ComingSoon />
      case "Help":
        return <KnownIssues />;
      default:
        return null;
    }
  };

  const inputItems = [
    {
      id: "allOptions",
      label: "Disable All Options",
      checked: options.disableAllOptions,
      onChange: () => setOptions({ ...options, disableAllOptions: !options.disableAllOptions }),
    },
    {
      id: "skipIntro",
      label: "Skip Intro",
      checked: options.skipIntro,
      onChange: () => setOptions({ ...options, skipIntro: !options.skipIntro }),
    },
    {
      id: "autoConnect",
      label: "Auto-Connect (must be logged in!)",
      checked: options.autoConnect,
      onChange: () => setOptions({ ...options, autoConnect: !options.autoConnect }),
    },
    {
      id: "nightMode",
      label: "Night Mode",
      checked: options.isNightMode,
      onChange: () => setOptions({ ...options, isNightMode: !options.isNightMode }),
    },
  ];

  return (
    <div className="container mx-auto flex items-stretch h-auto p-4">
      <div className="flex flex-col bg-gray-300 rounded-lg shadow-lg mb-8">
        <div ref={containerRef} className="flex items-center mb-4 bg-gray-700 justify-center p-2">
          <img src={logo} alt="DBE Logo" className="w-12 h-12" />
          <h2 className="text-xl font-bold text-white">
            {isSmall ? "DB" : "DuelingBook"}
            <span className="text-gray-400">
              {isSmall ? "E" : 'Enhanced'}
            </span>
          </h2>
        </div>
        <p className="text-xl font-semibold text-center">SETTINGS</p>
        <nav className="mt-4 text-white">
          <button
            className="bg-gray-700 hover:bg-gray-500 w-full py-2 mb-2"
            onClick={() => setCurrentSection("General")}>
            General
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-500 w-full py-2 mb-2"
            onClick={() => setCurrentSection("Customize Hotkeys")}>
            Customize Hotkeys
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-500 w-full py-2 mb-2"
            onClick={() => setCurrentSection("Advanced")}>
            Advanced
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-500 w-full py-2 mb-2"
            onClick={() => setCurrentSection("Help")}>
            Known Issues
          </button>
        </nav>
      </div>
      <div className="flex-grow p-4 pt-0 rounded-lg">

        <aside className="bg-gray-700 text-white p-4 mb-4 rounded-lg flex justify-center items-center align-middle text-lg space-x-4">
          <div className="flex items-center ">
            <img src={yugiIcon} alt="yugi icon" className="w-16 h-16 justify-center mb-2" />
          </div>
          <p className="">
            Join our Discord!
          </p>
          <button
            id="discord_button"
            className="bg-blue-500 font-bold flex justify-center items-center px-7 py-1 rounded-xl hover:bg-blue-400"
            onClick={() => window.open('https://discord.gg/hbGw3bDMfY', '_blank')}
          >
            <BsDiscord className="w-8 h-8 flex" />
          </button>
        </aside>

        <main className="relative">
          {renderMainContent()}
          {isSavedVisible && (
            <div className="flex justify-center">
              <div className="saved-settings-message bg-green-500 text-white px-4 py-2 rounded-md absolute top-0 animate-slide-down opacity-0 text-lg transition-transform duration-500">
                Settings Saved!
              </div>
            </div>
          )}
        </main>

        <footer className="pt-2">
          <div className="bg-gray-700 text-white p-4 mb-4 rounded-xl flex justify-center items-center align-middle text-lg space-x-4 flex-grow">
            <img src={coffee} alt="coffee" className="w-10 h-10" />
            <div className="">
              <span className="font-bold">Enjoying our Product?</span>
              <span> Share some support</span>
            </div>
            <button
              className="bg-blue-500 px-7 py-1 rounded-lg font-bold flex justify-center items-center hover:bg-blue-400"
              onClick={() => window.open('https://www.paypal.com/donate/?business=TNF5V5V9E869E&no_recurring=1&item_name=hi+this+is+alex+from+the+duelingbookenhanced+extension+-+if+you+want+to+buy+Joseph+%26+I+a+coffee+or+something+here%27s+where+2doit&currency_code=USD', '_blank')}><BiCoffeeTogo className="w-8 h-8 flex" /></button>
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
