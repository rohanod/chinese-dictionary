import Hanzi from 'hanzi'

Hanzi.start()

export interface DefinitionEntry {
	traditional: string
	simplified: string
	pinyin: string
	definition: string
}

export function searchByHanzi(text: string) {
	return Hanzi.dictionarySearch(text)
}

export function searchByEnglish(text: string) {
	const results = Hanzi.dictionarySearch(text)
	return results.filter((entries: DefinitionEntry[]) =>
		entries.some(e => e.definition.toLowerCase().includes(text.toLowerCase()))
	)
}

export function searchByPinyin(text: string) {
	const toneLess = text.toLowerCase().replace(/\d/g, '')
	const results = Hanzi.dictionarySearch(text)
	return results.filter((entries: DefinitionEntry[]) =>
		entries.some(e =>
			e.pinyin.replace(/\d/g, '').toLowerCase().includes(toneLess)
		)
	)
}

export function lookup(text: string) {
	return Hanzi.definitionLookup(text)
}

export function decompose(char: string) {
	return Hanzi.decompose(char, 2)
}

export function frequency(char: string) {
	return Hanzi.getCharacterFrequency(char)
}
