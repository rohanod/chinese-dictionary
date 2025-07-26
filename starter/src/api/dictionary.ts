// Note: chinese-lexicon has some browser compatibility issues
// For demo purposes, we'll implement basic dictionary functionality

let chineseLexicon: any = null
try {
	chineseLexicon = require('chinese-lexicon')
} catch (_error) {}

export interface DictionaryEntry {
	simp: string
	trad: string
	definitions: string[]
	pinyin: string
	searchablePinyin: string
	simpEtymology?:
		| {
				notes: string
				definition: string
				components: Array<{
					type: string
					char: string
					fragment?: number[]
				}>
		  }
		| undefined
	tradEtymology?:
		| {
				notes: string
				definition: string
				components: Array<{
					type: string
					char: string
					fragment?: number[]
				}>
		  }
		| undefined
	statistics?:
		| {
				hskLevel: number
				movieWordCount: number
				movieWordCountPercent: number
				movieWordRank: number
				movieWordContexts: number
				movieWordContextsPercent: number
				bookWordCount: number
				bookWordCountPercent: number
				bookWordRank: number
				movieCharCount: number
				movieCharCountPercent: number
				movieCharRank: number
				movieCharContexts: number
				movieCharContextsPercent: number
				bookCharCount: number
				bookCharCountPercent: number
				bookCharRank: number
				pinyinFrequency: number
		  }
		| undefined
}

// Mock dictionary data for demo purposes
const mockDictionary: Record<string, DictionaryEntry[]> = {
	你: [
		{
			simp: '你',
			trad: '你',
			definitions: ['you (informal)'],
			pinyin: 'nǐ',
			searchablePinyin: 'ni',
			simpEtymology: {
				notes:
					'Phonosemantic compound. 人 represents the meaning and 尔 represents the sound.',
				definition: 'you',
				components: [
					{type: 'meaning', char: '人'},
					{type: 'sound', char: '尔'}
				]
			},
			statistics: {
				hskLevel: 1,
				movieWordCount: 5000,
				movieWordCountPercent: 0.05,
				movieWordRank: 10,
				movieWordContexts: 950,
				movieWordContextsPercent: 0.95,
				bookWordCount: 6000,
				bookWordCountPercent: 0.06,
				bookWordRank: 8,
				movieCharCount: 8000,
				movieCharCountPercent: 0.08,
				movieCharRank: 5,
				movieCharContexts: 980,
				movieCharContextsPercent: 0.98,
				bookCharCount: 7000,
				bookCharCountPercent: 0.07,
				bookCharRank: 6,
				pinyinFrequency: 2000
			}
		}
	],
	你好: [
		{
			simp: '你好',
			trad: '你好',
			definitions: ['hello', 'hi'],
			pinyin: 'nǐhǎo',
			searchablePinyin: 'nihao',
			statistics: {
				hskLevel: 1,
				movieWordCount: 1500,
				movieWordCountPercent: 0.01,
				movieWordRank: 50,
				movieWordContexts: 800,
				movieWordContextsPercent: 0.8,
				bookWordCount: 2000,
				bookWordCountPercent: 0.02,
				bookWordRank: 30,
				movieCharCount: 3000,
				movieCharCountPercent: 0.03,
				movieCharRank: 25,
				movieCharContexts: 900,
				movieCharContextsPercent: 0.9,
				bookCharCount: 2500,
				bookCharCountPercent: 0.025,
				bookCharRank: 20,
				pinyinFrequency: 1000
			}
		}
	],
	好: [
		{
			simp: '好',
			trad: '好',
			definitions: [
				'good',
				'well',
				'proper',
				'good to',
				'easy to',
				'very',
				'so',
				'(suffix indicating completion or readiness)'
			],
			pinyin: 'hǎo',
			searchablePinyin: 'hao',
			simpEtymology: {
				notes: 'Ideographic compound: 女 (woman) + 子 (child) = good.',
				definition: 'good',
				components: [
					{type: 'meaning', char: '女'},
					{type: 'meaning', char: '子'}
				]
			},
			statistics: {
				hskLevel: 1,
				movieWordCount: 4500,
				movieWordCountPercent: 0.045,
				movieWordRank: 15,
				movieWordContexts: 920,
				movieWordContextsPercent: 0.92,
				bookWordCount: 5500,
				bookWordCountPercent: 0.055,
				bookWordRank: 12,
				movieCharCount: 7500,
				movieCharCountPercent: 0.075,
				movieCharRank: 8,
				movieCharContexts: 970,
				movieCharContextsPercent: 0.97,
				bookCharCount: 6500,
				bookCharCountPercent: 0.065,
				bookCharRank: 9,
				pinyinFrequency: 1800
			}
		}
	],
	我: [
		{
			simp: '我',
			trad: '我',
			definitions: ['I', 'me', 'my'],
			pinyin: 'wǒ',
			searchablePinyin: 'wo',
			simpEtymology: {
				notes: 'Pictographic representation of a hand holding a weapon.',
				definition: 'I, me',
				components: [
					{type: 'iconic', char: '手'},
					{type: 'iconic', char: '戈'}
				]
			},
			statistics: {
				hskLevel: 1,
				movieWordCount: 8000,
				movieWordCountPercent: 0.08,
				movieWordRank: 3,
				movieWordContexts: 990,
				movieWordContextsPercent: 0.99,
				bookWordCount: 9000,
				bookWordCountPercent: 0.09,
				bookWordRank: 2,
				movieCharCount: 12_000,
				movieCharCountPercent: 0.12,
				movieCharRank: 1,
				movieCharContexts: 995,
				movieCharContextsPercent: 0.995,
				bookCharCount: 11_000,
				bookCharCountPercent: 0.11,
				bookCharRank: 1,
				pinyinFrequency: 2500
			}
		}
	]
}

// Search mappings for different search types
const searchMappings: Record<string, string[]> = {
	nihao: ['你好'],
	hello: ['你好'],
	ni: ['你'],
	you: ['你'],
	wo: ['我'],
	i: ['我'],
	me: ['我'],
	hao: ['好'],
	good: ['好']
}

export interface SearchParams {
	query: string
	type: 'pinyin' | 'hanzi' | 'english'
	limit?: number
}

export interface CharacterData {
	character: string
	entries: DictionaryEntry[]
	radicals: string[]
	strokeCount: number
	components: string[]
}

export async function searchDictionary({
	query,
	type,
	limit = 10
}: SearchParams): Promise<DictionaryEntry[]> {
	try {
		// First try with the library if available
		if (chineseLexicon) {
			let results: any[] = []

			if (type === 'hanzi') {
				results = chineseLexicon.getEntries(query)
			} else if (type === 'pinyin' || type === 'english') {
				results = chineseLexicon.search(query, limit)
			}

			return results.map(entry => ({
				simp: entry.simp || '',
				trad: entry.trad || '',
				definitions: entry.definitions || [],
				pinyin: entry.pinyin || '',
				searchablePinyin: entry.searchablePinyin || '',
				simpEtymology: entry.simpEtymology,
				tradEtymology: entry.tradEtymology,
				statistics: entry.statistics
			}))
		}

		// Fall back to mock data
		const results: DictionaryEntry[] = []
		const queryLower = query.toLowerCase()

		if (type === 'hanzi') {
			// Direct character lookup
			if (mockDictionary[query]) {
				results.push(...mockDictionary[query])
			}
		} else {
			// Search by pinyin or english
			const matchingChars = searchMappings[queryLower] || []
			for (const char of matchingChars) {
				if (mockDictionary[char]) {
					results.push(...mockDictionary[char])
				}
			}
		}

		return results.slice(0, limit)
	} catch (_error) {
		return []
	}
}

export async function getCharacterData(
	character: string
): Promise<CharacterData> {
	try {
		// Try with library first
		if (chineseLexicon) {
			const entries = chineseLexicon.getEntries(character)

			const radicals = new Set<string>()
			entries.forEach((entry: any) => {
				if (entry.simpEtymology?.components) {
					entry.simpEtymology.components.forEach((comp: any) => {
						if (comp.type === 'meaning' || comp.type === 'sound') {
							radicals.add(comp.char)
						}
					})
				}
			})

			return {
				character,
				entries: entries.map((entry: any) => ({
					simp: entry.simp || '',
					trad: entry.trad || '',
					definitions: entry.definitions || [],
					pinyin: entry.pinyin || '',
					searchablePinyin: entry.searchablePinyin || '',
					simpEtymology: entry.simpEtymology,
					tradEtymology: entry.tradEtymology,
					statistics: entry.statistics
				})),
				radicals: Array.from(radicals),
				strokeCount: 0,
				components: Array.from(radicals)
			}
		}

		// Fall back to mock data
		if (mockDictionary[character]) {
			const entries = mockDictionary[character]
			const radicals = new Set<string>()

			entries.forEach(entry => {
				if (entry.simpEtymology?.components) {
					entry.simpEtymology.components.forEach(comp => {
						radicals.add(comp.char)
					})
				}
			})

			return {
				character,
				entries,
				radicals: Array.from(radicals),
				strokeCount:
					character === '你'
						? 7
						: character === '好'
							? 6
							: character === '我'
								? 7
								: 0,
				components: Array.from(radicals)
			}
		}

		throw new Error('Character not found')
	} catch (_error) {
		throw new Error('Character not found')
	}
}

export function getShortDefinition(word: string, pinyin?: string): string {
	try {
		if (chineseLexicon) {
			return chineseLexicon.getGloss(word, pinyin) || ''
		}

		// Fall back to mock data
		if (mockDictionary[word]?.[0]) {
			return mockDictionary[word][0].definitions[0] || ''
		}

		return ''
	} catch (_error) {
		return ''
	}
}
