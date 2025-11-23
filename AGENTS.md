Create a chinese(mandarin) dictionary website. Make sure it has these features:

# Search
* pinyin(fuzzy so tones not required)
* hanzi(exact)
* english word/phrase
* Make it so the content of the text boxes don't carry over when moving to the different search modes

# Translate
From english, pinyin or hanzi phrase to a page that is dynamically loaded.

# Character/Phrase page
* Hanzi static image
* Hanzi static image with stroke order numbers
* Hanzi gif with stroke order
* Hanzi image with different boxes for each step of writing(Basically each frame of the gif)
* Pinyin(with tones)
* English translation
* Literal english translation
* If it's a phrase, have different sections on the page for individual characters and the whole phrase(For whole phrase, make sure to modify the images and join them well or find a lib that you can just create an image of a whole phrase)
* All the radicals from that character in a list of image links that the user can click on to view the character page for that radical
* Make it so if there are multiple characters in a word or phrase, put all the characters in the character page so for nihao, it wouldn't be one page for ni and one for hao, instead, it would be one page for nihao
* If it's a phrase, make sure to have them looking seamlessly connected and not have two different containers for each word of the phrase
* When using hanzi-writer for writing a phrase, make sure to que them up so the words in the phrase play sequentially rather than concurrently
* Do not use the practice feature from hanzi-writer

Add all the info like stroke animation, radicals, english meaning(Find a lib for that), etc. I want it to look similar to this:

https://www.strokeorder.com/chinese/%E4%BD%A0

Use tavily extract to see it along with downloading the images and reading them

But not the "other characters" part like similar pronunciation and same radicals. I don't want a video, just a gif and no worksheet. Remove usage level thing. I still want the stroke order diagram so it shows each step and the step by step handwriting where it shows all the strokes at once with the number indicating what order to put it in

First do research then implement. That's how you should do this. 

# Personal lists
Feature where a user can save(using browser storage) lists of what they have learnt and what they are still trying to learn and other

# Requirements
* Try to implement react's new ViewTransition animations to create cool transitions
* Compatible with node v24.1.0
* Good UI/UX
* Always use the hanzi graphics from hanziwriter whenever showing hanzi
* NEVER HAVE MANUALLY INSERTED LISTS OF CHARACTERS, ONLY USE THE LIBRARIES/APIs TO GET DATA

# Documentation
To get documentation, curl this URL:

https://context7.com/{context7-id}/llms.txt?topic={topic}&tokens={tokens}

Tokens is optional

For Hanzi Writer, you can look through the documentation at docs/

Make sure to first create the next app.

We don't need auth or anything but we need all the libraries working.

I have found something that will help with almost the full character page: https://github.com/kevinhu/hotpot(Cloned at ./hotpot/) and you just need to add the hanziwriter part for the animation. See how it works when you start working on the backend 

I basically want a hotpot clone but with better looks and hanziwriter for the stroke order stuff.

I have the starter app at my-better-t-app/

```
(base) ➜  chinese-dictionary-codex git:(main) ✗ pnpm create better-t-stack@latest my-better-t-app --frontend tanstack-router --backend none --runtime none --api none --auth none --payments none --database none --orm none --db-setup none --package-manager pnpm --no-git --web-deploy none --server-deploy none --install --addons pwa tauri turborepo --examples none
Downloading @biomejs/wasm-nodejs@2.3.7: 6.07 MB/6.07 MB, done
.../19aaa538690-aee4                     |  +78 ++++++++
.../19aaa538690-aee4                     | Progress: resolved 78, reused 0, downloaded 78, added 78, done

 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 
┌  Creating a new Better-T-Stack project
│
●  Using these pre-selected options:
│
│  Frontend: tanstack-router
│  Backend: none
│  Runtime: none
│  API: none
│  Database: none
│  ORM: none
│  Auth: none
│  Payments: none
│  Addons: pwa, tauri, turborepo
│  Examples: none
│  Git Init: No
│  Package Manager: pnpm
│  Install Dependencies: Yes
│  Database Setup: none
│  Web Deployment: none
│  Server Deployment: none
│
│
│
◇  Tauri desktop app support configured successfully!
│
◆  Project template successfully scaffolded!
│
◇  Dependencies installed successfully

 ╭─────────────────────────────────────────────────────────────────╮
 │                                                                 │
 │  Next steps                                                     │
 │  1. cd my-better-t-app                                          │
 │  2. pnpm run dev                                                │
 │  Your project will be available at:                             │
 │  • Frontend: http://localhost:3001                              │
 │  • Backend API: http://localhost:3000                           │
 │                                                                 │
 │  Desktop app with Tauri:                                        │
 │  • Start desktop app: cd apps/web && pnpm run desktop:dev       │
 │  • Build desktop app: cd apps/web && pnpm run desktop:build     │
 │  NOTE: Tauri requires Rust and platform-specific dependencies.  │
 │     See: https://v2.tauri.app/start/prerequisites/              │
 │                                                                 │
 │  Like Better-T-Stack? Please consider giving us a star          │
 │     on GitHub:                                                  │
 │  https://github.com/AmanVarshney01/create-better-t-stack        │
 │                                                                 │
 ╰─────────────────────────────────────────────────────────────────╯

│
◆  You can reproduce this setup with the following command:
│  pnpm create better-t-stack@latest my-better-t-app --frontend tanstack-router --backend none --runtime none --database none --orm none --api none --auth none --payments none --addons pwa tauri turborepo --examples none --db-setup none --web-deploy none --server-deploy none --no-git --package-manager pnpm --install
│
└  Project created successfully in 41.27 seconds!

(base) ➜  chinese-dictionary-codex git:(main) ✗ 
```

You **will** analyse hotpot to see how the dictionary works.

THIS IS A TYPESCRIPT PROJECT

Make sure to copy the search_data.json building scripts from hotpot and convert them to js scripts (in the my-better-t-app/package.json or pnpm-workspace.yaml file)