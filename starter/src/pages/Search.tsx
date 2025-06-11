import {useState} from 'react'
import {
	type DefinitionEntry,
	searchByEnglish,
	searchByHanzi,
	searchByPinyin
} from '../api/dictionary'
import {TransitionLink} from '../components/TransitionLink'

const hanziRegex = /^[\u4e00-\u9fa5]+$/
const lettersRegex = /^[a-zA-Z]+$/

export function Search() {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<DefinitionEntry[][]>([])

	function onSearch() {
		let res: DefinitionEntry[][] = []
		if (hanziRegex.test(query)) {
			res = searchByHanzi(query)
		} else if (lettersRegex.test(query)) {
			res = searchByPinyin(query)
		} else {
			res = searchByEnglish(query)
		}
		setResults(res)
	}

	return (
		<div className='p-4'>
			<h1 className='mb-4 font-bold text-2xl'>Chinese Dictionary</h1>
			<input
				className='mr-2 border p-2'
				onChange={e => setQuery(e.target.value)}
				value={query}
			/>
			<button
				className='rounded bg-blue-500 px-4 py-2 text-white'
				onClick={onSearch}
				type='button'
			>
				Search
			</button>
			<ul className='mt-4'>
				{results.map(entries => (
					<li className='mb-2' key={entries[0]?.simplified}>
						<TransitionLink
							className='text-blue-600 underline'
							to={`/${entries[0]?.simplified}`}
						>
							{entries[0]?.simplified} - {entries[0]?.pinyin} -{' '}
							{entries[0]?.definition}
						</TransitionLink>
					</li>
				))}
			</ul>
		</div>
	)
}
