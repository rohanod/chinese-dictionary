Create a chinese(mandarin) dictionary website. It should be done in vite react. Make sure it has these features:

# Search by...
* pinyin(fuzzy so tones not required)
* hanzi(exact)
* english word/phrase

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
* How often it's used
* Audio recordings of the individual characters/words and of the whole phrase
* Example sentences

# Personal lists
Feature where a user can save(using browser storage) lists of what they have learnt and what they are still trying to learn and other

# Requirements
* Try to implement react's new ViewTransition animations to create cool transitions
* Compatible with node v24.1.0
* Good UI/UX

# Documentation
To get documentation, curl this URL:

https://context7.com/{context7-id}/llms.txt?topic={topic}&tokens={tokens}

Tokens is optional

## Context7 IDs
* vitejs/vite
* reactjs/react.dev

## Other things
Some things we are using aren't on context7 so I have made a file with the docs in docs/

# Libraries/Packages/Frameworks to use
- **Vite** – Development and build tool for fast hot-reloads and optimized production bundles
- **React** – Component-based UI library using a virtual DOM for efficient state-driven rendering
- **HanziJS** – Node.js library for CC-CEDICT lookup (hanzi→pinyin→English) and character decomposition (radicals, strokes, example words)
- **Hanzi Writer** – JavaScript library for rendering static SVGs and animated stroke-order sequences for simplified and traditional Chinese characters