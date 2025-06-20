## Install

```javascript
npm install hanzi
```

## How to use
### Initiate HanziJS. Required.

```javascript
//Require
var hanzi = require("hanzi");
//Initiate
hanzi.start();
```

### Functions

#### hanzi.decompose(character, type of decomposition);

A function that takes a Chinese character and returns an object with decomposition data. Type of decomposition is optional.

Type of decomposition levels:

* 1 - "Once" (only decomposes character once),
* 2 - "Radical" (decomposes character into its lowest radical components),
* 3 - "Graphical" (decomposes into lowest forms, will be mostly strokes and small indivisable units)

```javascript
var decomposition = hanzi.decompose('爱');
console.log(decomposition);

{ character: '爱',
  components1: [ 'No glyph available', '友' ],
  components2: [ '爫', '冖', '𠂇', '又' ],
  components3: [ '爫', '冖', '𠂇', '㇇', '㇏' ] }

//Example of forced level decomposition

var decomposition = hanzi.decompose('爱', 2);
console.log(decomposition);

{ character: '爱', components: [ '爫', '冖', '𠂇', '又' ] }
```

#### hanzi.decomposeMany(character string, type of decomposition);

A function that takes a string of characters and returns one object for all characters.

```javascript
var decomposition = hanzi.decomposeMany('爱橄黃');
console.log(decomposition);

{ '爱':
   { character: '爱',
     components1: [ 'No glyph available', '友' ],
     components2: [ '爫', '冖', '𠂇', '又' ],
     components3: [ '爫', '冖', '𠂇', '㇇', '㇏' ] },
  '橄':
   { character: '橄',
     components1: [ '木', '敢' ],
     components2: [ '木', 'No glyph available', '耳', '⺙' ],
     components3: [ '一', '丨', '八', '匚', '二', '丨', '二', '丿', '一', '乂' ] },
  '黃':
   { character: '黃',
     components1: [ '廿', 'No glyph available' ],
     components2: [ '黃' ],
     components3: [ '卄', '一', '一', '二', '丨', '凵', '八' ] } }
```

#### hanzi.ifComponentExists(character/component);

Check if a component/character exists in the data. Returns boolean value.

```javascript
console.log(hanzi.ifComponentExists('乂'));

true

console.log(hanzi.ifComponentExists('$'));

false
```

#### hanzi.definitionLookup(character/word, script type);

Returns a dictionary entry object. Script type is optional.

Script type parameters:

*   's' - Simplified
*   't' - Traditional

```javascript
console.log(hanzi.definitionLookup('雪'));

[ { traditional: '雪',
    simplified: '雪',
    pinyin: 'Xue3',
    definition: 'surname Xue' },
  { traditional: '雪',
    simplified: '雪',
    pinyin: 'xue3',
    definition: 'snow/snowfall/CL:場|场[chang2]/to have the appearance of snow/to wipe away, off or out/to clean' } ]
```

#### hanzi.dictionarySearch(characters, search type);

Searches the dictionary based on input. Search type changes what data it returns. Defaults to

Search type paramaters:

*   'only' - this parameter returns only entries with the characters specfied. This is a means to find all compounds words with the characters specified.
*   null - returns all occurences of the character.

```javascript
console.log(hanzi.dictionarySearch('雪'));

[ [ { traditional: '下雪',
      simplified: '下雪',
      pinyin: 'xia4 xue3',
      definition: 'to snow' } ],
  [ { traditional: '似雪',
      simplified: '似雪',
      pinyin: 'si4 xue3',
      definition: 'snowy' } ],
  [ { traditional: '冰天雪地',
      simplified: '冰天雪地',
      pinyin: 'bing1 tian1 xue3 di4',
      definition: 'a world of ice and snow' } ],
  [ { traditional: '冰雪',
      simplified: '冰雪',
      pinyin: 'bing1 xue3',
      definition: 'ice and snow' } ],
  [ { traditional: '冰雪皇后',
      simplified: '冰雪皇后',
      pinyin: 'bing1 xue3 huang2 hou4',
      definition: 'Dairy Queen (brand)' } ],
  [ { traditional: '冰雪聰明',
      simplified: '冰雪聪明',
      pinyin: 'bing1 xue3 cong1 ming5',
      definition: 'exceptionally intelligent (idiom)' } ],
  [ { traditional: '各人自掃門前雪，莫管他家瓦上霜',
      simplified: '各人自扫门前雪，莫管他家瓦上霜',
      pinyin: 'ge4 ren2 zi4 sao3 men2 qian2 xue3 , mo4 guan3 ta1 jia1 wa3 shang4 shuang1',
      definition: 'sweep the snow from your own door step, don\'t worry about the frost on your neighbor\'s roof (idiom)' } ],
  [ { traditional: '哈巴雪山',
      simplified: '哈巴雪山',
      pinyin: 'Ha1 ba1 xue3 shan1',
      definition: 'Mt Haba (Nakhi: golden flower), in Lijiang 麗江|丽江, northwest Yunnan' } ],
  [ { traditional: '單板滑雪',
      simplified: '单板滑雪',
      pinyin: 'dan1 ban3 hua2 xue3',
      definition: 'to snowboard' } ],
  [ { traditional: '報仇雪恥',
      simplified: '报仇雪耻',
      pinyin: 'bao4 chou2 xue3 chi3',
      definition: 'to take revenge and erase humiliation (idiom)' } ],

[....] //Truncated for display purposes

console.log(hanzi.dictionarySearch('心的小孩真', 'only'));

[ [ { traditional: '孩',
      simplified: '孩',
      pinyin: 'hai2',
      definition: 'child' } ],
  [ { traditional: '小',
      simplified: '小',
      pinyin: 'xiao3',
      definition: 'small/tiny/few/young' } ],
  [ { traditional: '小孩',
      simplified: '小孩',
      pinyin: 'xiao3 hai2',
      definition: 'child/CL:個|个[ge4]' } ],
  [ { traditional: '小小',
      simplified: '小小',
      pinyin: 'xiao3 xiao3',
      definition: 'very small/very few/very minor' } ],
  [ { traditional: '小心',
      simplified: '小心',
      pinyin: 'xiao3 xin1',
      definition: 'to be careful/to take care' } ],
  [ { traditional: '小的',
      simplified: '小的',
      pinyin: 'xiao3 de5',
      definition: 'I (when talking to a superior)' } ],
  [ { traditional: '心',
      simplified: '心',
      pinyin: 'xin1',
      definition: 'heart/mind/intention/centre/core/CL:顆|颗[ke1],個|个[ge4]' } ],
  [ { traditional: '的',
      simplified: '的',
      pinyin: 'de5',
      definition: 'of/~\'s (possessive particle)/(used after an attribute)/(used to form a nominal expression)/(used at the end of a declarative sentence for emphasis)' },
    { traditional: '的',
      simplified: '的',
      pinyin: 'di2',
      definition: 'really and truly' },
    { traditional: '的',
      simplified: '的',
      pinyin: 'di4',
      definition: 'aim/clear' } ],
  [ { traditional: '真',
      simplified: '真',
      pinyin: 'zhen1',
      definition: 'really/truly/indeed/real/true/genuine' } ],
  [ { traditional: '真心',
      simplified: '真心',
      pinyin: 'zhen1 xin1',
      definition: 'sincere/heartfelt/CL:片[pian4]' } ],
  [ { traditional: '真真',
      simplified: '真真',
      pinyin: 'zhen1 zhen1',
      definition: 'really/in fact/genuinely/scrupulously' } ] ]

```

#### hanzi.getExamples(character);

This function does a dictionarySearch(), then compares that to the Leiden University corpus for vocabulary frequency, then sorts the dictionary entries into three categories in an array: [high frequency, medium frequency and low frequency].

The frequency categories are determined relative to the frequency distribution of the dictionarySearch data compared to the corpus.

```javascript
console.log(hanzi.getExamples('橄'));

[ [ { traditional: '橄欖',
      simplified: '橄榄',
      pinyin: 'gan3 lan3',
      definition: 'Chinese olive/olive' },
    { traditional: '橄欖油',
      simplified: '橄榄油',
      pinyin: 'gan3 lan3 you2',
      definition: 'olive oil' } ],
  [ { traditional: '橄欖球',
      simplified: '橄榄球',
      pinyin: 'gan3 lan3 qiu2',
      definition: 'football played with oval-shaped ball (rugby, American football, Australian rules etc)' } ],
  [ { traditional: '橄欖枝',
      simplified: '橄榄枝',
      pinyin: 'gan3 lan3 zhi1',
      definition: 'olive branch/symbol of peace' },
    { traditional: '橄欖樹',
      simplified: '橄榄树',
      pinyin: 'gan3 lan3 shu4',
      definition: 'olive tree' },
    { traditional: '橄欖石',
      simplified: '橄榄石',
      pinyin: 'gan3 lan3 shi2',
      definition: 'olivine (rock-forming mineral magnesium-iron silicate (Mg,Fe)2SiO4)/peridot' } ] ]
```

#### hanzi.segment(phrase); - NEW in v0.5.0

Returns an array of characters that are segmented based on a longest match lookup.

````javascript
console.log(hanzi.segment("我們都是陌生人。"));

[ '我們', '都', '是', '陌生人', '。' ]
````

#### hanzi.getPinyin(character);

Returns all possible pinyin data for a character.

```javascript
console.log(hanzi.getPinyin('的'));

[ 'de5', 'di2', 'di4' ]
```

#### hanzi.getCharacterFrequency(character);

Returns frequency data for a character based on the Junda corpus. The data is in simplified characters, but I made the function script agnostic. So both traditional and simplified will return the same data.

```javascript
console.log(hanzi.getCharacterFrequency('热'));

{ number: '530',
  character: '热',
  count: '31190',
  percentage: '76.4970999352',
  pinyin: 're4',
  meaning: 'heat/to heat up/fervent/hot (of weather)/warm up' }
```

#### hanzi.getCharacterInFrequencyListByPosition(position); - NEW in v0.7.0

Gets a character based on its position the frequency list. This only goes up to 9933 based on the Junda Frequency list.

```javascript
console.log(hanzi.getCharacterInFrequencyListByPosition(111));

{ number: '111',
  character: '机',
  count: '339823',
  percentage: '43.7756134862',
  pinyin: 'ji1',
  meaning: 'machine/opportunity/secret' }
```

#### hanzi.getCharactersWithComponent(component);

Returns an array of characters with the given component. If a component has bound forms, such as 手 and 扌, they're considered the same and returns all the characters with the component.

NB: This feature is new. Data might not be hundred percent correct and consistent.

```javascript
console.log(hanzi.getCharactersWithComponent('囗'));

[ '国','因','西','回','口','四','团','图','围','困','固','园','圆','圈','囚','圃','囤','囿','囡','囫','圜','囵','囹','圄','囝','圉','圊','釦']
```

#### hanzi.determinePhoneticRegularity(decomposition_object/character);

This function takes a decomposition object created by hanzi.decompose() or a character, then returns an object that displays all possible combinations of phonetic regularity relationship of the character to all its components.

Phonetic Regularity Scale:

*   0 = No regularity
*   1 = Exact Match (with tone)
*   2 = Syllable Match (without tone)
*   3 = Similar in Initial (alliterates)
*   4 = Similar in Final (rhymes)

The object returned is organized by the possible pronunciations of the character. You may notice duplicate entries in the fields, but these are there based on the similarities between the decomposition levels. It is up to the developer to use this data or not.

```javascript
console.log(hanzi.determinePhoneticRegularity('洋'));

{ yang2:
   { character: '洋',
     component: [ '氵', '羊', '羊', '氵', '羊', '羊' ],
     phoneticpinyin: [ 'shui3', 'Yang2', 'yang2', 'shui3', 'Yang2', 'yang2' ],
     regularity: [ 0, 1, 1, 0, 1, 1 ] } }
```

#### hanzi.getRadicalMeaning(radical);

Returns a short, usually one-word, meaning of a radical.

```javascript
console.log(hanzi.getRadicalMeaning('氵'));

water
```