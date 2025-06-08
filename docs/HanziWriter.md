Installation
============

Loading Hanzi Writer in a script tag
------------------------------------

The simplest option is to load the Hanzi Writer JS directly from the jsdelivr CDN. Just put the following in the head of your webpage:

```html
<script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
```

You can also download a copy of the Hanzi Writer javascript here:

**[hanzi-writer.min.js](https://cdn.jsdelivr.net/npm/hanzi-writer/dist/hanzi-writer.min.js)** - minified for production (30 kb, 9kb gzipped)

**[hanzi-writer.js](https://cdn.jsdelivr.net/npm/hanzi-writer/dist/hanzi-writer.js)** - unminified for development (70 kb)

The above scripts will make a global `HanziWriter` variable available after the script loads.

Loading Hanzi Writer via npm
----------------------------

If you want to include Hanzi Writer in webpack or node.js, you can install from npm: `npm install hanzi-writer`. Then, you can include Hanzi Writer in your code via:

```javascript
const HanziWriter = require('hanzi-writer');
```

Note: working with old browsers

 If you want to use Hanzi Writer with old versions of internet explorer (10 and 11) you'll need to provide a polyfill for the Promise api. An easy way to do that is by using polyfill.io. Add the following to your webpage before loading Hanzi Writer: 

```html
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
```

Basic usage
===========

Rendering to the screen
-----------------------

Creating a new `HanziWriter` instance requires passing in a target div (either ID or DOM reference), the character you'd like to render, and configuration options. A simple example is illustrated below. Assuming in HTML you have:

```html
<div id="character-target-div"></div>
```

Then, in Javascript:

```javascript
var writer = HanziWriter.create('character-target-div', '我', {
  width: 100,
  height: 100,
  padding: 5
});
```

You can see the result of this below:

In the above example width and height are the size of the box containing the character in pixels, and padding is the space between the character and the edge of the box, also in pixels. You can configure other options as well, like the color of the character. Below is an example drawn with different sizing and colors:

```javascript
var writer = HanziWriter.create('character-target-div', '爽', {
  width: 150,
  height: 150,
  padding: 20,
  strokeColor: '#EE00FF' // pink
});
```

Hanzi Writer also supports coloring the radical of a character differently. You set the color to display the radical with the `radicalColor` option. Below is an example of the word 草 with the radical colored green.

```javascript
var writer = HanziWriter.create('character-target-div', '草', {
  width: 150,
  height: 150,
  padding: 5,
  radicalColor: '#168F16' // green
});
```

Animation
---------

After you create a HanziWriter instance you can animate it by calling the `animateCharacter()` method. In the example below, the character is animated when a button is pressed. the HTML looks like the following:

```html
<div id="character-target-div"></div>
<button id="animate-button">Animate</button>
```

Then, the corresponding javascript:

```javascript
var writer = HanziWriter.create('character-target-div', '国', {
  width: 100,
  height: 100,
  padding: 5,
  showOutline: true
});
document.getElementById('animate-button').addEventListener('click', function() {
  writer.animateCharacter();
});
```
Animate
There are also a number of options you can configure with animations to control things like the speed of the animation and whether or not the character outline is visible. You can also set a radical color if you'd like to show the character radical while animating. Below is another example of animating with different animation options:

```javascript
var writer = HanziWriter.create('character-target-div', '激', {
  width: 100,
  height: 100,
  padding: 5,
  showOutline: false,
  strokeAnimationSpeed: 5, // 5x normal speed
  delayBetweenStrokes: 10, // milliseconds
  radicalColor: '#337ab7' // blue
});
document.getElementById('animate-button').addEventListener('click', function() {
  writer.animateCharacter();
});
```
Fast
Looping Animations
------------------

It's common to repeat an animation over and over. You can call `loopCharacterAnimation()` to start and animation that will keep looping. There's a configuration option `delayBetweenLoops` you can use to control how much time there is between each animation loop (default 2000 ms). In the example below, the character will wait 3 seconds and then redraw itself forever:

```javascript
var writer = HanziWriter.create('character-target-div', '轮', {
  width: 100,
  height: 100,
  padding: 5,
  delayBetweenLoops: 3000
});

writer.loopCharacterAnimation();
```

Chaining character animations
-----------------------------

You can pass an onComplete callback when running `animateCharacter({ onComplete: function() { ... }})` that you can use to cause one character to start animating after another finishes. If you prefer to use promises instead, the `animateCharacter()` method will also return a promise which resolves when the animation is complete. Below is an example of 2 characters animating in order, one after another with 1 second between drawing each character. The example uses `onComplete` to trigger the next character to start after the first finishes. the HTML looks like:

```html
<div id="character-target-1"></div>
<div id="character-target-2"></div>
<button id="animate-button">Start</button>
```

And the javascript:

```javascript
var char1 = HanziWriter.create('character-target-1', '很', {
  width: 100,
  height: 100,
  padding: 5,
  showCharacter: false
});
var char2 = HanziWriter.create('character-target-2', '爽', {
  width: 100,
  height: 100,
  padding: 5,
  showCharacter: false
});

function chainAnimations() {
  var delayBetweenAnimations = 1000; // milliseconds
  char1.hideCharacter();
  char2.hideCharacter();

  char1.animateCharacter({
    onComplete: function() {
      setTimeout(function() {
        char2.animateCharacter();
      }, delayBetweenAnimations);
    }
  });
}

document.getElementById('animate-button').addEventListener('click', chainAnimations);
```
Start
Quizzing
--------

You can start a quiz by calling the `quiz()` method. We can set up a simple quiz with the code below:

```javascript
var writer = HanziWriter.create('character-target-div', '测', {
  width: 150,
  height: 150,
  showCharacter: false,
  padding: 5
});
writer.quiz();
```
Reset
Try drawing the character 测 above to get a feel for how quizzes work. If you miss a stroke 3 times it will give you a hint by highlighting the correct stroke. You can configure this behavior by setting the `showHintAfterMisses` option to a different number, or you can set `showHintAfterMisses: false` to disable it entirely. After a quiz is completed successfully it will flash briefly. You can disable this by setting `highlightOnComplete: false`. Below is an example with some of these options changed. The example below also sets `showOutline: false` to make it more challenging.

```javascript
var writer = HanziWriter.create('character-target-div', '鬼', {
  width: 150,
  height: 150,
  showCharacter: false,
  showOutline: false,
  showHintAfterMisses: 1,
  highlightOnComplete: false,
  padding: 5
});
writer.quiz();
```
Reset
Try drawing the character 鬼 above.

Integrating Quizzes
-------------------

Quizzes on their own are good practice, but they become really poweful when they interact with the rest of your code. The `quiz()` method can be passed callbacks that you can use to run code when events happen in the quiz, like getting a stroke right or wrong, or the quiz finishing. The callbacks are called `onCorrectStroke`, `onMistake` and `onComplete`. These callbacks get passed an object containing info about the current state of the quiz. Below is an example of how you can integrate these callbacks:

```javascript
var writer = HanziWriter.create('character-target-div', '码', {
  width: 150,
  height: 150,
  showCharacter: false,
  padding: 5
});
writer.quiz({
  onMistake: function(strokeData) {
    console.log('Oh no! you made a mistake on stroke ' + strokeData.strokeNum);
    console.log("You've made " + strokeData.mistakesOnStroke + " mistakes on this stroke so far");
    console.log("You've made " + strokeData.totalMistakes + " total mistakes on this quiz");
    console.log("There are " + strokeData.strokesRemaining + " strokes remaining in this character");
  },
  onCorrectStroke: function(strokeData) {
    console.log('Yes!!! You got stroke ' + strokeData.strokeNum + ' correct!');
    console.log('You made ' + strokeData.mistakesOnStroke + ' mistakes on this stroke');
    console.log("You've made " + strokeData.totalMistakes + ' total mistakes on this quiz');
    console.log('There are ' + strokeData.strokesRemaining + ' strokes remaining in this character');
  },
  onComplete: function(summaryData) {
    console.log('You did it! You finished drawing ' + summaryData.character);
    console.log('You made ' + summaryData.totalMistakes + ' total mistakes on this quiz');
  }
});
```
Reset
Try drawing the character 码 above, and watch the output appear in the virtual console.

Other methods
-------------

Aside from the core capability of animating and quizzing, there are several other methods available to control the rendering of a character.

*   `writer.setCharacter(newCharacter)` Load a new character and rerender. 
*   `writer.showCharacter()` Show the character if it is currently hidden 
*   `writer.hideCharacter()` Hide the character if it is currently shown 
*   `writer.showOutline()` Show the character outline if it's currently hidden 
*   `writer.hideOutline()` Hide the character outline if it's currently shown 
*   `writer.updateColor(colorName, newValue)` Change the value of any color option. For example: `writer.updateColor('strokeColor', '#AA12CD')`
*   `writer.cancelQuiz()` Immediately cancel the currently running quiz 

Advanced usage
==============

Loading character data
----------------------

Hanzi Writer needs to load stroke rendering data in order to draw characters. By default Hanzi Writer will load this data from the [jsdelivr CDN](https://www.jsdelivr.com/package/npm/hanzi-writer-data) using ajax. This is probably fine for embedding Hanzi Writer into a website, but depending on how you're using Hanzi Writer there may be better ways to load character data. For example, if you're buidling a mobile app and want to embed Hanzi Writer into the app it's best to load character data locally so that character data is loaded instantly and without needing an internet connection.

There is a sister repo called [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) which contains the data for each individual character as a separate JSON file. You can host these files from your server and load them via AJAX inside of Hanzi Writer however you see fit. This data can also be loaded via NPM to include individual character data in your JS. Loading character data is way is accomplished via passing a custom closure to the _charDataLoader_ option. An example is shown below using jQuery:

```javascript
var writer = HanziWriter.create('target', '我', {
  charDataLoader: function(char, onComplete) {
    $.getJSON("/my/server/" + char + ".json", function(charData) {
      onComplete(charData);
    });
  }
});
```

The repo also contains all.json which contain all characters in 1 file, but these files are quite large (28mb) so they're probably not ideal for production use.

If you know in advance which character you'd like to render you can hardcode just the data for that character into the _charDataLoader_ closure. To do this, you can make use of the [hanzi-writer-data](https://www.npmjs.com/package/hanzi-writer-data) NPM module and directly require character data inline. This technique ensures that Hanzi Writer will be able to render the character instantly without needing to wait for an AJAX request to complete. Below is an example of loading character data for the character **人** via the hanzi-writer-data NPM module. First, make sure the hanzi-writer-data module is installed by running: `npm install hanzi-writer-data`.

```javascript
var ren = require('hanzi-writer-data/人');

var writer = HanziWriter.create('target', '人', {
  charDataLoader: function() {
    return ren;
  }
});
```

If you would like to be notified when character data is loaded successfully or when it fails (for example to implement a loading spinner or show an error message), you can pass `onLoadCharDataSuccess` and `onLoadCharDataError` callbacks when creating a HanziWriter instance. For example:

```javascript
var ren = require('hanzi-writer-data/人');

var writer = HanziWriter.create('target', '人', {
  onLoadCharDataSuccess: function(data) {
    console.log('Success!');
  },
  onLoadCharDataError: function(reason) {
    console.log('Oh No! Something went wrong :(');
  }
});
```

Raw Character SVG
-----------------

Sometimes you may want to render Hanzi writer character data but don't need stroke animations or stroke quizzes. Hanzi writer provides 2 static helper methods which make it easy to load and render raw character data.

You can load character data from the Hanzi writer CDN using the static method `HanziWriter.loadCharacterData(character, options = {})`. This method will return a promise containing the loaded data for the character, but you can also pass `onLoadCharDataSuccess` and `onLoadCharDataError` callbacks as options if you prefer. The character data that's loaded will be the same as what's in the [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data/tree/master/data) repo, which are all parsed out from [makemeahanzi](https://github.com/skishore/makemeahanzi).

The trickest part about rendering the SVG paths for Hanzi writer data is that the characters must be transformed to appear on the screen at the desired size, usually in a `<g>` tag. For example, to render the SVG for a character at size 128 x 128, the SVG would look something like this:

```html
<svg>
  <g transform="translate(0, 112.5) scale(0.125, -0.125)">
    <path d="...path from hanzi writer data..."></path>
    <path d="...path from hanzi writer data..."></path>
    <path d="...path from hanzi writer data..."></path>
    ...
  </g>
</svg>
```

Fortunately, there's a static method `HanziWriter.getScalingTransform(width, height, padding = 0)` which makes this easy. This method returns transform data which you can use in SVG to draw the character at the specified size. Below is an example of loading data for the character **六** and rendering the character SVG at size 150 x 150 inside a div with ID `target`:

```javascript
HanziWriter.loadCharacterData('六').then(function(charData) {
  var target = document.getElementById('target');
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '150px';
  svg.style.height = '150px';
  target.appendChild(svg);
  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // set the transform property on the g element so the character renders at 150x150
  var transformData = HanziWriter.getScalingTransform(150, 150);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  charData.strokes.forEach(function(strokePath) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    // style the character paths
    path.style.fill = '#555';
    group.appendChild(path);
  });
});
```

Using raw character data gives you the full power of SVG to implement visualizations that don't require stroke animation or quizzing. For example, below is an example of using raw character data to implement a stroke fanning visualization of the character **是**:

```javascript
function renderFanningStrokes(target, strokes) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '75px';
  svg.style.height = '75px';
  svg.style.border = '1px solid #EEE'
  svg.style.marginRight = '3px'
  target.appendChild(svg);
  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // set the transform property on the g element so the character renders at 75x75
  var transformData = HanziWriter.getScalingTransform(75, 75);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  strokes.forEach(function(strokePath) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    // style the character paths
    path.style.fill = '#555';
    group.appendChild(path);
  });
}

HanziWriter.loadCharacterData('是').then(function(charData) {
  var target = document.getElementById('target');
  for (var i = 0; i < charData.strokes.length; i++) {
    var strokesPortion = charData.strokes.slice(0, i + 1);
    renderFanningStrokes(target, strokesPortion);
  }
});
```

The examples above use raw javascript browser APIs for SVG rendering, but the code would be even simpler using a library to help manage SVG, like [svg.js](http://svgjs.com/) or [raphael.js](http://dmitrybaranovskiy.github.io/raphael/).

Custom backgrounds
==================

If you already have an `<SVG>` or `<G>` element on the page, you can render a HanziWriter instance into that instead of using a DIV. This makes it easy to add custom backgrounds like a grid directly in SVG. For example, we can draw a simple grid in SVG like below:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" id="grid-background-target">
  <line x1="0" y1="0" x2="100" y2="100" stroke="#DDD" />
  <line x1="100" y1="0" x2="0" y2="100" stroke="#DDD" />
  <line x1="50" y1="0" x2="50" y2="100" stroke="#DDD" />
  <line x1="0" y1="50" x2="100" y2="50" stroke="#DDD" />
</svg>
```

Then, we can render into this SVG by using its ID, just like we can with a normal div:

```javascript
var writer = HanziWriter.create('grid-background-target', '酷', {
  width: 100,
  height: 100,
  padding: 5,
});
```

API
===

HanziWriter
-----------

This is the core class you will interact with.

#### new HanziWriter(element, options)

Set up a new HanziWriter instance the specified DOM element

`element` DOM node or ID of the element to render into.

`options` object containing additional configuration options. Full options available include:

*   `showOutline:` boolean, default true. Controls whether the outline is shown or hidden on the first render.
*   `showCharacter:` boolean, default true. Controls whether the character is shown or hidden on the first render.
*   `width:` number. Width of the canvas in px.
*   `height:` number. height of the canvas in px.
*   `padding:` number, default 20. padding between the character and edge of the canvas in px.
*   `strokeAnimationSpeed:` number, default 1. Speed at which to draw each stroke, must be greater than 0. Increase this number to draw strokes faster, decrease to draw strokes slower.
*   `strokeHighlightSpeed:` number, default 2. Speed at which to highlight each stroke when givings hints in a quiz, must be greater than 0. Increase this number to highlight faster, decrease to highlight slower.
*   `strokeFadeDuration:` number, default 400. Time in milliseconds to transition between showing and hiding strokes when calling `writer.show()` and `writer.hide()`
*   `delayBetweenStrokes:` number, default 1000. Time in milliseconds between each stroke when animating.
*   `delayBetweenLoops:` number, default 2000. Time in milliseconds between each animation loop when looping animations.
*   `strokeColor:` hex string, default '#555'. The color to draw each stroke.
*   `radicalColor:` hex string, default null. The color to draw the radical in the stroke, if radical data is present. Radicals will be drawn the same color as other strokes if this is not set.
*   `highlightColor:` hex string, default '#AAF'. The color to use for highlighting in quizzes.
*   `outlineColor:` hex string, default '#DDD'. The color of the character outline.
*   `drawingColor:` hex string, default '#333'. The color of the lines drawn by users during quizzing.
*   `drawingWidth:` number, default 4. The width of the lines drawn by users during quizzing in px.
*   `showHintAfterMisses:` integer, default 3. The number of misses before a stroke highlight hint is given to the user. Set to false to disable. This can also be set when creating a quiz.
*   `markStrokeCorrectAfterMisses:` integer, default disabled. The number of misses before forcing the stroke to be marked correct. This can also be set when creating a quiz.
*   `quizStartStrokeNum:` integer, default 0. This can be set to start the quiz at a stroke other than the first stroke. This can also be set when creating a quiz.
*   `acceptBackwardsStrokes:` boolean, default false. Allow stroke to be drawn backwards during quizzing. This can also be set when creating a quiz.
*   `highlightOnComplete:` boolean, default true. Controls whether a quiz briefly highlights the character when the user finishes drawing the whole character. This can also be set when creating a quiz.
*   `highlightCompleteColor:` hex string, default null. The color to use when highlighting the character on complete in quizzes. If not set, `highlightColor` will be used instead. Only relevant if `highlightOnComplete` is `true`.
*   `charDataLoader:` function. Custom function to load charater data. See the section on [Loading character data](https://hanziwriter.org/docs.html#loading-character-data-link) for more info on usage.
*   `onLoadCharDataSuccess:` function. Callback for when character data is loaded successfully. This function is called with the data that was loaded. This can be used to implement a loading spinner.
*   `onLoadCharDataError:` function. Callback for when character data loading fails. This function is passed whatever the failure reason is from _charDataLoader_.
*   `renderer:` string, default 'svg'. Set this to 'canvas' to render using a 2d canvas instead of SVG. May have better performance on some devices.

### Instance methods

#### writer.showCharacter(options = {})

Show the character if it's currently hidden.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the showing animation is complete.
*   `duration:` number, optional. How long the showing animation should take to complete. If not provided then `strokeFadeDuration` is used. Passing 0 will make the operation instant.

#### writer.hideCharacter(options = {})

Hide the character if it's currently shown.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the hiding animation is complete.
*   `duration:` number, optional. How long the hiding animation should take to complete. If not provided then `strokeFadeDuration` is used. Passing 0 will make the operation instant.

#### writer.showOutline(options = {})

Show the outline if it's currently hidden.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the showing animation is complete.
*   `duration:` number, optional. How long the showing animation should take to complete. If not provided then `strokeFadeDuration` is used. Passing 0 will make the operation instant.

#### writer.hideOutline(options = {})

Hide the outline if it's currently shown.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the hiding animation is complete.
*   `duration:` number, optional. How long the hiding animation should take to complete. If not provided then `strokeFadeDuration` is used. Passing 0 will make the operation instant.

#### writer.updateDimensions(options = {})

Update the size of the writer instance

`options` object containing additional configuration options. Full options include:

*   `width:` number, optional, the new width in px
*   `height:` number, optional, the new height in px
*   `padding:` number, optional, the new padding in px

#### writer.updateColor(colorName, colorVal, options = {})

Update a color setting.

`colorName` string. One of 'strokeColor', 'radicalColor', 'outlineColor', 'highlightColor', or 'drawingColor'.

`colorVal` string. A CSS color string like '#AA9913' or 'rgba(255, 255, 10, 0.7)'

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the hiding animation is complete.
*   `duration:` number, optional. How long the animation should take to complete. If not provided then `strokeFadeDuration` is used. Passing 0 will make the operation instant.

#### writer.animateCharacter(options = {})

Animate the strokes of the character in order

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the animation is complete.

#### writer.animateStroke(strokeNum, options = {})

Animate a single stroke

`strokeNum` number. The stroke number to animate, starting at 0.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the animation is complete.

#### writer.highlightStroke(strokeNum, options = {})

Highlight a single stroke

`strokeNum` number. The stroke number to highlight, starting at 0.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function. Called when the animation is complete.

#### writer.loopCharacterAnimation()

Animate the strokes of the character in order, and then restart the animation after it finishes forever.

#### writer.pauseAnimation()

Pause any currently running animations.

#### writer.resumeAnimation()

Resume any animations that were previously paused with `pauseAnimation()`.

#### writer.setCharacter(character)

Replace the currently drawn character with a new one. This will reset any quizzes or animations in progress.

`character` The character to draw, ex '你'.

#### writer.quiz(options)

Start a quiz.

`options` object containing additional configuration options. Full options include:

*   `onComplete:` function(data). Called when the quiz is complete. The function is called with an object containing `totalMistakes` which is the total mistakes made during the quiz.
*   `onCorrectStroke:` function(data). Called when the user draws a stroke correctly. The function is called with an object containing: 
    *   `totalMistakes` the total mistakes made during the quiz so far. 
    *   `strokeNum` the current stroke number. 
    *   `mistakesOnStroke` the number of mistakes the user made drawing this stroke so far. 
    *   `strokesRemaining` the number of strokes left until the quiz is complete. 
    *   `drawnPath` an object containg the `pathString` drawn by the user and the `points` used for grading. 

*   `onMistake:` function(data). Called when the user makes a mistake drawing a stroke. The function is called with an object containing: 
    *   `totalMistakes` the total mistakes made during the quiz so far. 
    *   `strokeNum` the current stroke number. 
    *   `mistakesOnStroke` the number of mistakes the user made drawing this stroke so far. 
    *   `strokesRemaining` the number of strokes left until the quiz is complete. 
    *   `drawnPath` an object containg the `pathString` drawn by the user and the `points` used for grading. 

*   `showHintAfterMisses:` integer, default 3. The number of misses before a stroke highlight hint is given to the user. Set to false to disable. This can also be set when creating the writer instance.
*   `markStrokeCorrectAfterMisses:` integer, default disabled. The number of misses before forcing the stroke to be marked correct.
*   `quizStartStrokeNum:` integer, default 0. This can be set to start the quiz at a stroke other than the first stroke.
*   `acceptBackwardsStrokes:` boolean, default false. Allow stroke to be drawn backwards during quizzing.
*   `leniency:` float, default 1.0. This can be set to make stroke grading more or less lenient. The closer this is to 0 the more strictly the quiz is graded.
*   `highlightOnComplete:` boolean, default true. Controls whether a quiz briefly highlights the character when the user finishes drawing the whole character. This can also be set when creating the writer instance.

#### writer.cancelQuiz()

Cancel the quiz currently in progress

### Class methods

#### HanziWriter.create(element, character, options)

Set up a new HanziWriter instance the specified DOM element

`element` DOM node or ID of the element to render into.

`character` The character to draw, ex '你'.

`options` object containing additional configuration options. Full options available include:

*   `showOutline:` boolean, default true. Controls whether the outline is shown or hidden on the first render.
*   `showCharacter:` boolean, default true. Controls whether the character is shown or hidden on the first render.
*   `width:` number. Width of the canvas in px.
*   `height:` number. height of the canvas in px.
*   `padding:` number, default 20. padding between the character and edge of the canvas in px.
*   `strokeAnimationSpeed:` number, default 1. Speed at which to draw each stroke, must be greater than 0. Increase this number to draw strokes faster, decrease to draw strokes slower.
*   `strokeHighlightSpeed:` number, default 2. Speed at which to highlight each stroke when givings hints in a quiz, must be greater than 0. Increase this number to highlight faster, decrease to highlight slower.
*   `strokeFadeDuration:` number, default 400. Time in milliseconds to transition between showing and hiding strokes when calling `writer.show()` and `writer.hide()`
*   `delayBetweenStrokes:` number, default 1000. Time in milliseconds between each stroke when animating.
*   `delayBetweenLoops:` number, default 2000. Time in milliseconds between each animation loop when looping animations.
*   `strokeColor:` hex string, default '#555'. The color to draw each stroke.
*   `radicalColor:` hex string, default null. The color to draw the radical in the stroke, if radical data is present. Radicals will be drawn the same color as other strokes if this is not set.
*   `highlightColor:` hex string, default '#AAF'. The color to use for highlighting in quizzes.
*   `outlineColor:` hex string, default '#DDD'. The color of the character outline.
*   `drawingColor:` hex string, default '#333'. The color of the lines drawn by users during quizzing.
*   `drawingWidth:` number, default 4. The width of the lines drawn by users during quizzing in px.
*   `showHintAfterMisses:` integer, default 3. The number of misses before a stroke highlight hint is given to the user. Set to false to disable. This can also be set when creating a quiz.
*   `markStrokeCorrectAfterMisses:` integer, default disabled. The number of misses before forcing the stroke to be marked correct. This can also be set when creating a quiz.
*   `quizStartStrokeNum:` integer, default 0. This can be set to start the quiz at a stroke other than the first stroke. This can also be set when creating a quiz.
*   `acceptBackwardsStrokes:` boolean, default false. Allow stroke to be drawn backwards during quizzing. This can also be set when creating a quiz.
*   `highlightOnComplete:` boolean, default true. Controls whether a quiz briefly highlights the character when the user finishes drawing the whole character. This can also be set when creating a quiz.
*   `highlightCompleteColor:` hex string, default null. The color to use when highlighting the character on complete in quizzes. If not set, `highlightColor` will be used instead. Only relevant if `highlightOnComplete` is `true`.
*   `charDataLoader:` function. Custom function to load charater data. See the section on [Loading character data](https://hanziwriter.org/docs.html#loading-character-data-link) for more info on usage.
*   `onLoadCharDataSuccess:` function. Callback for when character data is loaded successfully. This function is called with the data that was loaded. This can be used to implement a loading spinner.
*   `onLoadCharDataError:` function. Callback for when character data loading fails. This function is passed whatever the failure reason is from _charDataLoader_.
*   `renderer:` string, default 'svg'. Set this to 'canvas' to render using a 2d canvas instead of SVG. May have better performance on some devices.

#### HanziWriter.loadCharacterData(character, options = {})

Load raw character data from the Hanzi Writer CDN. Returns a promise which resolves when loading is complete.

`character` The character to draw, ex '你'.

`options` object containing additional configuration options. Full options available include:

*   `charDataLoader:` function. Custom function to load charater data. See the section on [Loading character data](https://hanziwriter.org/docs.html#loading-character-data-link) for more info on usage.
*   `onLoadCharDataSuccess:` function. Callback for when character data is loaded successfully. This function is passed the data that was loaded
*   `onLoadCharDataError:` function. Callback for when character data loading fails. This function is passed whatever the failure reason is from _charDataLoader_.

#### HanziWriter.getScalingTransform(width, height, padding = 0)

Return an object containing scaling info which can be used when rendering raw character data in SVG.

`width` number, the width of the character to be rendered in px.

`height` number, height of the character to be rendered in px.

`padding` number, extra padding around the character. default 0.

**return value** object, containing the following keys: 
*   `x:` number. The x offset used in translate.
*   `y:` number. The y offset used in translate.
*   `scale:` number. The scale used in the scale part of the transform.
*   `transform:` string. The SVG transform string which can be directly used in the `transform` attribute of a `<g>` element to scale and position character path strings in SVG.