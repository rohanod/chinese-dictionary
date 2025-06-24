import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// @ts-expect-error TODO: Add type definitions for chinese-lexicon
import { search as searchLexicon, getEntries } from 'chinese-lexicon';

interface SearchResult {
	simp: string;
	trad: string;
	pinyin: string;
	definitions: string[];
}

export function Search() {
	const [searchMode, setSearchMode] = useState<'pinyin' | 'hanzi' | 'english'>('pinyin');
	const [inputValue, setInputValue] = useState('');
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleModeChange = (mode: 'pinyin' | 'hanzi' | 'english') => {
		setSearchMode(mode);
		setInputValue('');
		setResults([]);
	};

	useEffect(() => {
		if (inputValue.trim() === '') {
			setResults([]);
			return;
		}

		setIsLoading(true);
		let searchPromise;

		if (searchMode === 'hanzi') {
			searchPromise = Promise.resolve(getEntries(inputValue));
		} else {
			// Pinyin (fuzzy) and English search
			// For Pinyin, chinese-lexicon's search function is already fuzzy regarding tones.
			searchPromise = Promise.resolve(searchLexicon(inputValue));
		}

		searchPromise
			.then((data: SearchResult[]) => {
				setResults(data || []);
			})
			.catch((error: Error) => {
				console.error("Search error:", error);
				setResults([]);
			})
			.finally(() => {
				setIsLoading(false);
			});

	}, [inputValue, searchMode]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Search</h1>
			<div className="mb-4">
				<button onClick={() => handleModeChange('pinyin')} className={`mr-2 p-2 ${searchMode === 'pinyin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Pinyin</button>
				<button onClick={() => handleModeChange('hanzi')} className={`mr-2 p-2 ${searchMode === 'hanzi' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Hanzi</button>
				<button onClick={() => handleModeChange('english')} className={`p-2 ${searchMode === 'english' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>English</button>
			</div>
			<input
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder={`Enter ${searchMode}...`}
				className="border p-2 w-full mb-4"
			/>
			{isLoading && <p>Loading...</p>}
			{!isLoading && results.length === 0 && inputValue.trim() !== '' && <p>No results found.</p>}
			{!isLoading && results.length > 0 && (
				<ul>
					{results.map((result, index) => (
						<li key={index} className="border-b p-2">
							<Link to={`/character/${result.simp}`} className="text-blue-600 hover:underline">
								<h2 className="text-xl">{result.simp} ({result.trad})</h2>
							</Link>
							<p className="text-gray-600">{result.pinyin}</p>
							<p>{result.definitions.join('; ')}</p>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
