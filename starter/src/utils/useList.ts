import {useEffect, useState} from 'react'

export function useList(key: string) {
	const [items, setItems] = useState<string[]>([])

	useEffect(() => {
		const stored = localStorage.getItem(key)
		if (stored) {
			setItems(JSON.parse(stored))
		}
	}, [key])

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(items))
	}, [key, items])

	function add(item: string) {
		setItems(prev => (prev.includes(item) ? prev : [...prev, item]))
	}

	function remove(item: string) {
		setItems(prev => prev.filter(i => i !== item))
	}

	return {items, add, remove}
}
