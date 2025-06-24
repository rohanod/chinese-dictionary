import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
// @ts-expect-error TODO: Add type definitions for chinese-lexicon
import { getEntries, getEtymology } from 'chinese-lexicon';
import HanziWriter from 'hanzi-writer';

const LOCAL_STORAGE_KEY_LISTS = 'chineseDictionaryLists';

interface ListItem {
	id: string;
}
interface CharacterList {
	name: string;
	items: ListItem[];
}

interface CharacterData {
	simp: string;
	trad: string;
	pinyin: string;
	definitions: string[];
	hskLevel?: number;
	radicals?: Array<{ char: string, type: string }>; // Extracted from etymology
	frequency?: number; // from statistics (e.g., movieCharRank or bookCharRank)
	// exampleSentences?: string[]; // This is not directly in chinese-lexicon
	// audioUrl?: string; // Need a source for this
}

export function CharacterPage() {
	const { term } = useParams<{ term: string }>();
	const [charInfo, setCharInfo] = useState<CharacterData | null>(null);
	const [phraseChars, setPhraseChars] = useState<CharacterData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userLists, setUserLists] = useState<CharacterList[]>([]);
	const [showAddToList, setShowAddToList] = useState(false);

	// Refs for HanziWriter
	const staticWriterRef = useRef<HTMLDivElement>(null);
	const strokeOrderWriterRef = useRef<HTMLDivElement>(null);
	const animatedGifWriterRef = useRef<HTMLDivElement>(null);
	const fanningStrokesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Load user lists from localStorage
		const storedLists = localStorage.getItem(LOCAL_STORAGE_KEY_LISTS);
		if (storedLists) {
			try {
				setUserLists(JSON.parse(storedLists));
			} catch (e) {
				console.error("Failed to parse lists from localStorage", e);
			}
		}
	}, []);

	useEffect(() => {
		if (!term) {
			setError("No character or phrase provided.");
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);
		setCharInfo(null);
		setPhraseChars([]);
		setShowAddToList(false); // Reset visibility of add to list dropdown

		const fetchData = async () => {
			try {
				const entries = getEntries(term);

				if (entries && entries.length > 0) {
					const mainEntry = entries[0];
					let radicalsArray: Array<{ char: string, type: string }> = [];
					if (term.length === 1) { // Etymology/radicals for single characters
						const etymology = getEtymology(term);
						if (etymology && etymology.components) {
							radicalsArray = etymology.components.map((comp: any) => ({ char: comp.char, type: comp.type }));
						}
					}

					setCharInfo({
						simp: mainEntry.simp,
						trad: mainEntry.trad,
						pinyin: mainEntry.pinyin,
						definitions: mainEntry.definitions,
						hskLevel: mainEntry.statistics?.hskLevel,
						radicals: radicalsArray.length > 0 ? radicalsArray : undefined,
						frequency: mainEntry.statistics?.bookCharRank ?? mainEntry.statistics?.movieCharRank,
					});

					if (term.length > 1) {
						const individualCharsData: CharacterData[] = [];
						for (const char of term) {
							const charEntries = getEntries(char);
							if (charEntries && charEntries.length > 0) {
								// Fetch etymology for individual characters in a phrase too
								let indRadicals: Array<{ char: string, type: string }> = [];
								const etym = getEtymology(char);
								if (etym && etym.components) {
									indRadicals = etym.components.map((comp: any) => ({ char: comp.char, type: comp.type }));
								}
								individualCharsData.push({
									simp: charEntries[0].simp,
									trad: charEntries[0].trad,
									pinyin: charEntries[0].pinyin,
									definitions: charEntries[0].definitions,
									hskLevel: charEntries[0].statistics?.hskLevel,
									radicals: indRadicals.length > 0 ? indRadicals : undefined,
								});
							}
						}
						setPhraseChars(individualCharsData);
					}
				} else {
					setError(`No information found for "${term}".`);
				}
			} catch (e) {
				console.error("Error fetching character data:", e);
				setError("Failed to load character data.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [term]);

	useEffect(() => {
		if (!charInfo || !charInfo.simp) return;

		const currentTerm = charInfo.simp; // Use the simplified form for HanziWriter

		const clearDiv = (div: HTMLDivElement | null) => { if (div) div.innerHTML = ''; };
		clearDiv(staticWriterRef.current);
		clearDiv(strokeOrderWriterRef.current);
		clearDiv(animatedGifWriterRef.current);
		clearDiv(fanningStrokesContainerRef.current);

		if (staticWriterRef.current) {
			HanziWriter.create(staticWriterRef.current, currentTerm, { width: 100, height: 100, padding: 5 });
		}
		if (strokeOrderWriterRef.current) {
			// Hacky way to show stroke order numbers - uses quiz mode
			const writer = HanziWriter.create(strokeOrderWriterRef.current, currentTerm, {
				width: 100, height: 100, padding: 5, showCharacter: false, showOutline: true,
			});
			writer.quiz(); // This shows numbers. We might need to cancel it or find a better way.
		}
		if (animatedGifWriterRef.current) {
			const writer = HanziWriter.create(animatedGifWriterRef.current, currentTerm, {
				width: 100, height: 100, padding: 5, showCharacter: false, delayBetweenLoops: 1000,
			});
			writer.loopCharacterAnimation();
		}
		if (fanningStrokesContainerRef.current) {
			if (currentTerm.length === 1) {
				HanziWriter.loadCharacterData(currentTerm).then(charData => {
					if (!fanningStrokesContainerRef.current) return;
					fanningStrokesContainerRef.current.innerHTML = ''; // Clear previous
					for (let i = 0; i < charData.strokes.length; i++) {
						const strokesPortion = charData.strokes.slice(0, i + 1);
						const targetDiv = document.createElement('div');
						targetDiv.style.display = 'inline-block';
						targetDiv.style.margin = '2px';
						fanningStrokesContainerRef.current.appendChild(targetDiv);

						const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
						svg.style.width = '50px';
						svg.style.height = '50px';
						targetDiv.appendChild(svg);
						const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
						const transformData = HanziWriter.getScalingTransform(50, 50, 3);
						group.setAttributeNS(null, 'transform', transformData.transform);
						svg.appendChild(group);
						strokesPortion.forEach((strokePath: string) => {
							const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
							path.setAttributeNS(null, 'd', strokePath);
							path.style.fill = '#555';
							group.appendChild(path);
						});
					}
				}).catch(e => console.error("Error loading char data for fanning strokes", e));
			} else {
				// For phrases, create a combined image
				HanziWriter.create(fanningStrokesContainerRef.current, currentTerm, {
					width: currentTerm.length * 70, // Adjust width based on phrase length
					height: 70,
					padding: 5,
				});
				// Note: Fanning strokes for multi-character phrases is complex and not directly supported by HanziWriter in a simple way.
				// The line above will render the whole phrase statically instead of fanning.
				// A true "fanning" for phrases would require significant custom SVG logic.
			}
		}
	}, [charInfo]);

	const handleAddToList = (listName: string) => {
		if (!charInfo) return;
		const itemToAdd: ListItem = { id: term! }; // term should be defined if charInfo is set

		const updatedLists = userLists.map(list => {
			if (list.name === listName) {
				// Avoid duplicates
				if (!list.items.find(item => item.id === itemToAdd.id)) {
					return { ...list, items: [...list.items, itemToAdd] };
				}
			}
			return list;
		});

		setUserLists(updatedLists);
		localStorage.setItem(LOCAL_STORAGE_KEY_LISTS, JSON.stringify(updatedLists));
		setShowAddToList(false); // Hide dropdown after adding
		alert(`"${term}" added to "${listName}"`);
	};

	if (isLoading) return <div className="container mx-auto p-4"><p>Loading character information...</p></div>;
	if (error) return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
	if (!charInfo) return <div className="container mx-auto p-4"><p>No character data found.</p></div>;

	const currentDisplayTerm = charInfo.simp; // What to display in titles, etc.

	return (
		<div className="container mx-auto p-4">
			<section className="mb-6 p-4 border rounded-lg shadow-md bg-white">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-5xl font-bold mb-1" lang="zh-CN">{currentDisplayTerm}</h1>
						{charInfo.trad && charInfo.simp !== charInfo.trad && (
							<p className="text-xl text-gray-500" lang="zh-TW">({charInfo.trad})</p>
						)}
						<p className="text-3xl text-blue-600 my-2">{charInfo.pinyin}</p>
					</div>
					<div className="relative">
						<button
							onClick={() => setShowAddToList(!showAddToList)}
							className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
						>
							Add to List
						</button>
						{showAddToList && userLists.length > 0 && (
							<div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl z-10">
								{userLists.map(list => (
									<button
										key={list.name}
										onClick={() => handleAddToList(list.name)}
										className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										{list.name}
										{list.items.find(item => item.id === term) && <span className="text-green-500 ml-2">✓</span>}
									</button>
								))}
							</div>
						)}
						{showAddToList && userLists.length === 0 && (
							<div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl z-10 p-2 text-sm text-gray-500">
								No lists created yet. Go to "My Lists" to create one.
							</div>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-6 text-center">
					<div>
						<h3 className="font-semibold text-lg mb-1">Static</h3>
						<div ref={staticWriterRef} className="h-32 w-32 border rounded-md inline-block shadow-sm bg-gray-50"></div>
					</div>
					<div>
						<h3 className="font-semibold text-lg mb-1">Stroke Order</h3>
						<div ref={strokeOrderWriterRef} className="h-32 w-32 border rounded-md inline-block shadow-sm bg-gray-50"></div>
					</div>
					<div>
						<h3 className="font-semibold text-lg mb-1">Animated</h3>
						<div ref={animatedGifWriterRef} className="h-32 w-32 border rounded-md inline-block shadow-sm bg-gray-50"></div>
					</div>
				</div>
				<div>
					<h3 className="font-semibold text-lg mb-2">Stroke Steps / Phrase</h3>
					<div ref={fanningStrokesContainerRef} className="flex flex-wrap items-center justify-center p-2 border rounded-md bg-gray-50 min-h-[70px]">
						{/* HanziWriter for fanning strokes or full phrase */}
					</div>
				</div>
			</section>

			<section className="mb-6 p-4 border rounded-lg shadow-md bg-white">
				<h2 className="text-2xl font-semibold mb-3 border-b pb-2">Definitions</h2>
				<ul className="list-disc pl-6 space-y-1">
					{charInfo.definitions.map((def, i) => <li key={i} className="text-gray-700">{def}</li>)}
				</ul>
			</section>

			<section className="mb-6 p-4 border rounded-lg shadow-md bg-white">
				<h2 className="text-2xl font-semibold mb-3 border-b pb-2">Details</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{charInfo.hskLevel && <p><strong>HSK Level:</strong> {charInfo.hskLevel !== 7 ? charInfo.hskLevel : 'N/A (Not in HSK 1-6)'}</p>}
					{charInfo.frequency && <p><strong>Frequency Rank (Books):</strong> {charInfo.frequency}</p>}
					{charInfo.radicals && charInfo.radicals.length > 0 && (
						<div>
							<strong>Radical Components:</strong>
							<ul className="list-inside list-disc">
								{charInfo.radicals.map(rad => (
									<li key={rad.char}>
										<Link to={`/character/${rad.char}`} className="text-blue-600 hover:underline">{rad.char}</Link> ({rad.type})
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
				{/* TODO: Literal English translation, example sentences, audio */}
			</section>

			{phraseChars.length > 0 && (
				<section className="p-4 border rounded-lg shadow-md bg-white">
					<h2 className="text-2xl font-semibold mb-3 border-b pb-2">Individual Characters in Phrase: "{term}"</h2>
					<div className="space-y-4">
						{phraseChars.map(pc => (
							<div key={pc.simp} className="p-3 border rounded-md bg-gray-50 hover:shadow-lg transition-shadow">
								<h3 className="text-2xl font-bold" lang="zh-CN">
									<Link to={`/character/${pc.simp}`} className="text-blue-700 hover:underline">{pc.simp}</Link>
									{pc.trad && pc.simp !== pc.trad && <span className="text-gray-500 text-lg"> ({pc.trad})</span>}
								</h3>
								<p className="text-xl text-blue-500">{pc.pinyin}</p>
								{pc.radicals && pc.radicals.length > 0 && (
									<p className="text-sm text-gray-600">
										Radicals: {pc.radicals.map(r => <Link key={r.char} to={`/character/${r.char}`} className="text-blue-600 hover:underline">{r.char}</Link>).reduce((prev, curr) => <>{prev}, {curr}</>)}
									</p>
								)}
								<ul className="list-disc pl-5 text-sm mt-1">
									{pc.definitions.slice(0,2).map((def, i) => <li key={i} className="text-gray-600">{def}</li>)}
									{pc.definitions.length > 2 && <li className="text-gray-400 text-xs">...and more</li>}
								</ul>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
