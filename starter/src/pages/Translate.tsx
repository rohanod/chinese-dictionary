import { useState } from 'react';
import { Link } from 'react-router-dom';
// @ts-expect-error TODO: Add type definitions for chinese-lexicon
import { getEntries, search as searchLexicon } from 'chinese-lexicon';

interface TranslationSegment {
	type: 'text' | 'char';
	content: string;
	charData?: {
		simp: string;
		trad: string;
		pinyin: string;
		definitions: string[];
	}
}

export function Translate() {
	const [inputValue, setInputValue] = useState('');
	const [translationResult, setTranslationResult] = useState<TranslationSegment[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const isChinese = (text: string) => /[\u4e00-\u9fa5]/.test(text);
	const isPinyin = (text: string) => /[a-zA-ZüÜ\d\s:]+[\d]*/.test(text) && !/[a-zA-Z]{2,}/.test(text.replace(/\d/g, '')); // Basic pinyin check

	const handleTranslate = async () => {
		if (inputValue.trim() === '') {
			setTranslationResult([]);
			return;
		}
		setIsLoading(true);
		setTranslationResult([]);

		// This is a simplified approach. True phrase translation is complex.
		// We'll try to identify parts of the phrase and link them.
		// For English, we'll search for it and provide links to possible Chinese equivalents.
		// For Chinese/Pinyin, we'll break it down by character if possible.

		const segments: TranslationSegment[] = [];
		const input = inputValue.trim();

		if (isChinese(input)) {
			// Assume Hanzi phrase
			for (const char of input) {
				if (isChinese(char)) {
					const entries = await getEntries(char);
					if (entries && entries.length > 0) {
						segments.push({ type: 'char', content: char, charData: entries[0] });
					} else {
						segments.push({ type: 'text', content: char });
					}
				} else {
					segments.push({ type: 'text', content: char });
				}
			}
		} else if (isPinyin(input) && !/[a-z]{3,}/i.test(input.replace(/\d/g,'').replace(/\s/g,''))) { // trying to avoid treating plain english as pinyin
			// Attempt to treat as Pinyin - this is very basic
			// A more robust solution would involve a proper Pinyin parser
			const terms = input.split(/\s+/);
			for (const term of terms) {
				const results = await searchLexicon(term);
				if (results && results.length > 0 && results[0].pinyin.replace(/\s/g,'').startsWith(term.toLowerCase().replace(/\d/g,''))) {
					segments.push({ type: 'char', content: results[0].simp, charData: results[0] });
				} else {
					segments.push({ type: 'text', content: term });
				}
			}
		} else {
			// Assume English phrase or mixed content not easily parsable as Hanzi/Pinyin
			// We'll search for the whole phrase.
			const results = await searchLexicon(input);
			if (results && results.length > 0) {
				// Display the first few relevant results as potential translations
				results.slice(0, 5).forEach(entry => {
					segments.push({type: 'char', content: entry.simp, charData: entry });
					segments.push({type: 'text', content: ` (${entry.pinyin}): ${entry.definitions.join('; ')}`});
					segments.push({type: 'text', content: '\n'});
				});
				if (results.length === 0) {
					segments.push({ type: 'text', content: `No direct translation found for "${input}". You can try searching for individual words.` });
				}
			} else {
				segments.push({ type: 'text', content: `Could not find a translation for "${input}".` });
			}
		}

		setTranslationResult(segments);
		setIsLoading(false);
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Translate</h1>
			<textarea
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				placeholder="Enter English, Pinyin, or Hanzi phrase..."
				className="border p-2 w-full h-32 mb-4"
			/>
			<button onClick={handleTranslate} className="bg-blue-500 text-white p-2" disabled={isLoading}>
				{isLoading ? 'Translating...' : 'Translate'}
			</button>
			{translationResult.length > 0 && (
				<div className="mt-4 p-4 border rounded bg-gray-50">
					<h2 className="text-xl font-semibold mb-2">Translation:</h2>
					<p className="whitespace-pre-wrap">
						{translationResult.map((segment, index) =>
							segment.type === 'char' && segment.charData ? (
								<Link key={index} to={`/character/${segment.content}`} className="text-blue-600 hover:underline font-semibold">
									{segment.content}
								</Link>
							) : (
								<span key={index}>{segment.content}</span>
							)
						)}
					</p>
				</div>
			)}
		</div>
	);
}
