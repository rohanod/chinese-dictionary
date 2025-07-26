interface PersonalList {
	id: string
	name: string
	words: string[]
	createdAt: string
	updatedAt: string
}

interface PersonalListsData {
	lists: PersonalList[]
	learned: string[]
	learning: string[]
}

const STORAGE_KEY = 'chinese-dictionary-lists'

function getStorageData(): PersonalListsData {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		if (!data) {
			return {lists: [], learned: [], learning: []}
		}
		return JSON.parse(data)
	} catch (_error) {
		return {lists: [], learned: [], learning: []}
	}
}

function saveStorageData(data: PersonalListsData): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
	} catch (_error) {}
}

export function getPersonalLists(): PersonalList[] {
	return getStorageData().lists
}

export function createPersonalList(name: string): PersonalList {
	const data = getStorageData()
	const newList: PersonalList = {
		id: `list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		name,
		words: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}

	data.lists.push(newList)
	saveStorageData(data)
	return newList
}

export function updatePersonalList(
	listId: string,
	updates: Partial<Pick<PersonalList, 'name' | 'words'>>
): PersonalList | null {
	const data = getStorageData()
	const listIndex = data.lists.findIndex(list => list.id === listId)

	if (listIndex === -1) {
		return null
	}

	const updatedList: PersonalList = {
		...data.lists[listIndex]!,
		...updates,
		updatedAt: new Date().toISOString()
	}

	data.lists[listIndex] = updatedList
	saveStorageData(data)
	return updatedList
}

export function deletePersonalList(listId: string): boolean {
	const data = getStorageData()
	const listIndex = data.lists.findIndex(list => list.id === listId)

	if (listIndex === -1) {
		return false
	}

	data.lists.splice(listIndex, 1)
	saveStorageData(data)
	return true
}

export function addWordToList(listId: string, word: string): boolean {
	const data = getStorageData()
	const list = data.lists.find(list => list.id === listId)

	if (!list) {
		return false
	}

	if (!list.words.includes(word)) {
		list.words.push(word)
		list.updatedAt = new Date().toISOString()
		saveStorageData(data)
	}

	return true
}

export function removeWordFromList(listId: string, word: string): boolean {
	const data = getStorageData()
	const list = data.lists.find(list => list.id === listId)

	if (!list) {
		return false
	}

	const wordIndex = list.words.indexOf(word)
	if (wordIndex !== -1) {
		list.words.splice(wordIndex, 1)
		list.updatedAt = new Date().toISOString()
		saveStorageData(data)
	}

	return true
}

export function getLearnedWords(): string[] {
	return getStorageData().learned
}

export function getLearningWords(): string[] {
	return getStorageData().learning
}

export function addToLearned(word: string): void {
	const data = getStorageData()
	if (!data.learned.includes(word)) {
		data.learned.push(word)
		// Remove from learning if it's there
		const learningIndex = data.learning.indexOf(word)
		if (learningIndex !== -1) {
			data.learning.splice(learningIndex, 1)
		}
		saveStorageData(data)
	}
}

export function addToLearning(word: string): void {
	const data = getStorageData()
	if (!(data.learning.includes(word) || data.learned.includes(word))) {
		data.learning.push(word)
		saveStorageData(data)
	}
}

export function removeFromLearned(word: string): void {
	const data = getStorageData()
	const index = data.learned.indexOf(word)
	if (index !== -1) {
		data.learned.splice(index, 1)
		saveStorageData(data)
	}
}

export function removeFromLearning(word: string): void {
	const data = getStorageData()
	const index = data.learning.indexOf(word)
	if (index !== -1) {
		data.learning.splice(index, 1)
		saveStorageData(data)
	}
}

export function isWordLearned(word: string): boolean {
	return getStorageData().learned.includes(word)
}

export function isWordLearning(word: string): boolean {
	return getStorageData().learning.includes(word)
}

export type {PersonalList, PersonalListsData}
