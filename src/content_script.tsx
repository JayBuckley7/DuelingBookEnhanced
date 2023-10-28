import { OptionsTypes } from "./utilities/optionsUtility";
import { injectStylesheet, applyDarkMode, removeDarkMode } from "./utilities/darkModeUtility";
import { autoConnect, skipIntro } from "./utilities/optionsUtility";
import { loadHotkeysConfig, getActionsForHotkey } from "./utilities/configUtility";
import { debounce } from "lodash";

let view: HTMLElement | null;
let closeViewButton: HTMLElement | null;
let deck: HTMLElement | null;
let extraDeck: HTMLElement | null;
let deckMenu: HTMLElement | null;
let deckViewButton: HTMLElement | null;
let deckViewSpan: HTMLElement | null;
let duelField: HTMLElement | null;

function closeViewMenu() {
  closeViewButton?.click();
}

function handleDeckView(deckType: string) {
  const mouseOverEvent = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
    view: window,
  });

  if (deckType === 'Main') {
    deck?.dispatchEvent(mouseOverEvent);
  } else if (deckType === 'Extra') {
    extraDeck?.dispatchEvent(mouseOverEvent);
  }

  deckMenu = document.getElementById('card_menu_content') as HTMLElement;
  deckViewButton = deckMenu?.getElementsByClassName('card_menu_btn')[0] as HTMLElement;
  deckViewSpan = deckViewButton?.getElementsByTagName('span')[0] as HTMLElement;

  if (deckViewSpan && deckViewSpan.textContent === 'View') {
    deckViewSpan.click();
  } else if (deckViewSpan && deckViewSpan.textContent === 'Show') {
    deckViewButton = deckMenu?.getElementsByClassName('card_menu_btn')[1] as HTMLElement;
    deckViewSpan = deckViewButton?.getElementsByTagName('span')[0] as HTMLElement;
    deckViewSpan.click();
  } else {
    closeViewMenu()
  }
}

window.onload = async function () {
  view = document.getElementById('view') as HTMLElement;
  closeViewButton = view?.getElementsByClassName('exit_btn')[0] as HTMLElement;
  deck = document.getElementById('deck_hidden') as HTMLElement;
  extraDeck = document.getElementById('extra_hidden') as HTMLElement;
  deckMenu = document.getElementById('card_menu_content') as HTMLElement;
  deckViewButton = deckMenu?.getElementsByClassName('card_menu_btn')[0] as HTMLElement;
  deckViewSpan = deckViewButton?.getElementsByTagName('span')[0] as HTMLElement;
  duelField = document.getElementById('duel') as HTMLElement;

  let options: OptionsTypes;

  const actionFunctionMap: Record<string, () => void> = {
    "Close View Menu": closeViewMenu,
    "View Graveyard": toggleGraveYardView,
    "View Main Deck": () => handleDeckView('Main'),
    "View Extra Deck": () => handleDeckView('Extra'),
    "Think": handleThinkButton,
    "Thumbs Up": handleThumbsUpButton,
    "Toggle Chat Box": handleChatBox,
    "Declare": () => playCard("Declare"),
    "To Hand": () => playCard("To Hand"),
    "To S/T": () => playCard("To S/T"),
    "Activate": () => playCard("Activate"),
    "S. Summon ATK": () => playCard("S. Summon ATK"),
    "SS ATK": () => playCard("SS ATK"),
    "Normal Summon": () => playCard("Normal Summon"),
    "Set": () => playCard("Set"),
    "To Graveyard": () => playCard("To Graveyard"),
    "To Grave": () => playCard("To Grave"),
    "Banish": () => playCard("Banish"),
    "Banish FD": () => playCard("Banish FD"),
    "To B. Deck": () => playCard("To B. Deck"),
    "To Bottom of Deck": () => playCard("To Bottom of Deck"),
    "Mill 1": () => saySomething('/mill 1'),
    "Mill 2": () => saySomething('/mill 2'),
    "Mill 3": () => saySomething('/mill 3'),
    "Mill 4": () => saySomething('/mill 4'),
    "Mill 5": () => saySomething('/mill 5'),
    "Mill 6": () => saySomething('/mill 6')
  };

  let hotkeyHashMap = await loadHotkeysConfig();

  async function fetchHotKeyHashMap() {
    hotkeyHashMap = await loadHotkeysConfig();
    console.log('Loaded hotkeys configuration:', hotkeyHashMap);
  }

  injectStylesheet('dark-mode.css');

  chrome.storage.sync.get('options', (result) => {
    options = result.options as OptionsTypes;
    if (options && options.disableAllOptions) {
      // set all options to false, ensure dark mode is off, and don't run other functions
      options.skipIntro = false;
      options.autoConnect = false;
      options.isNightMode = false;
      removeDarkMode();
      hotkeyHashMap = [];
    } else {
      fetchHotKeyHashMap()
      if (options && options.skipIntro && options.autoConnect) autoConnect(skipIntroButton, enterButton);
      if (options && options.skipIntro) skipIntro(skipIntroButton);
      if (options && options.autoConnect) autoConnect(skipIntroButton, enterButton);
      if (options && options.isNightMode) applyDarkMode();
      if (options && !options.isNightMode) removeDarkMode();
    }
  });

  function handleOptionsChange(changes: { [key: string]: any }, namespace: string) {
    if (namespace === "sync") {
      if (changes.options && "newValue" in changes.options) {
        const newOptions = changes.options.newValue as OptionsTypes;
        console.log("Options have changed:", newOptions);

        if (newOptions.disableAllOptions) {
          // set all options to false, ensure dark mode is off, and don't run other functions
          newOptions.skipIntro = false;
          newOptions.autoConnect = false;
          newOptions.isNightMode = false;
          removeDarkMode();
          hotkeyHashMap = [];
        } else {
          fetchHotKeyHashMap()
          if (newOptions.skipIntro && newOptions.autoConnect) autoConnect(skipIntroButton, enterButton);
          if (newOptions.skipIntro) skipIntro(skipIntroButton);
          if (newOptions.autoConnect) autoConnect(skipIntroButton, enterButton);
          if (newOptions.isNightMode) applyDarkMode();
          if (!newOptions.isNightMode) removeDarkMode();
        }
      }
    }
  }

  chrome.storage.onChanged.addListener(handleOptionsChange);

  const chatInput = document.querySelectorAll('input.cin_txt')[1] as HTMLInputElement;
  let chatInputFocused = false;

  const thunk = document.getElementById('think_btn');
  const thumbsUp = document.getElementById('good_btn');
  const graveyard = document.getElementById('grave_hidden');
  const skipIntroButton = document.getElementById('skip_intro_btn') as HTMLElement;
  const enterButton = document.getElementById('duel_btn') as HTMLElement;

  function saySomething(message: string) {
    chatInput.value = message;
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
    });

    handleChatBox()
    chatInput.dispatchEvent(enterEvent);
  }

  function toggleGraveYardView() {
    if (view && view.style.display === 'block') {
      console.log("Closing the GY");
      closeViewMenu()
    } else {
      graveyard?.click()
      console.log("Opening the GY", graveyard);
    }
  }

  function handleThinkButton() {
    thunk?.click();
    saySomething('hm');
  }

  function handleThumbsUpButton() {
    thumbsUp?.click();
  }

  function handleChatBox() {
    if (!chatInputFocused) {
      chatInput.focus();
      chatInputFocused = true;
    } else {
      chatInput.blur();
      chatInputFocused = false;
    }
  }

  function playCard(action: string | [string] | [string, string]) {
    const cardHoverMenuDiv = document.getElementById('card_menu_content') as HTMLElement;
    const cardHoverMenuActions = cardHoverMenuDiv?.getElementsByClassName('card_menu_btn') as HTMLCollectionOf<HTMLElement>;

    const actions = Array.isArray(action) ? action : [action];
    console.log(action)
    for (const act of actions) {
      console.log(act)
      console.log(actions)
      for (const element of cardHoverMenuActions) {

        const span = element?.getElementsByTagName('span')[0];
        if (span && span.textContent === action) {
          span.click();
          return;
        }
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {

    const handler = e.key.toLowerCase();

    if (!(e.target instanceof HTMLInputElement) || handler === 'enter') {
      console.log('Key pressed:', handler);

      // use the updated `getActionsForHotkey` function
      const actions = getActionsForHotkey(handler, hotkeyHashMap);
      console.log('actions', actions)

      if (actions.length > 0) {
        actions.forEach((action) => {
          if (action in actionFunctionMap) {
            actionFunctionMap[action]();
            console.log('Action executed:', action);
          } else {
            console.log('Action function not found for:', action);
          }
        });
      } else {
        console.log('No matching actions found.');
      }
    }
  }

  // adjust this timer for user responsiveness
  const debouncedKeydown = debounce((e: KeyboardEvent) => handleKeydown(e), 150);

  document.addEventListener('keydown', debouncedKeydown);
}
