Create a chinese(mandarin) dictionary website. It should be done in vite react. Make sure it has these features:

## Search by...
* pinyin(fuzzy so tones not required)
* hanzi(exact)
* english word/phrase

## Translate
From english, pinyin or hanzi phrase to a page that is dynamically loaded.

## Character/Phrase page
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

## AI Powered
* Chatbot(Gemini 2.0 flash) with some useful tools. Allow it to use a tool to embed a useful thing. Make sure it will be able to use "Generative UI"



## Requirements
* Use the Vercel AI SDK for AI features and Vercel AI SDK UI for the interface so we can easily make the chatbot(llms.txt/documentation is at vercel-ai-llms.txt)
* Try to implement react's new ViewTransition animations to create cool transitions
* 


The gemini api key is saved at $VITE_GEMINI_API_KEY
