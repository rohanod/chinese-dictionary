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
		<div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 p-4 text-white'>
			<div className='mx-auto max-w-xl rounded-xl bg-white/20 p-6 shadow-lg backdrop-blur'>
				<h1 className='mb-6 text-center font-extrabold text-4xl drop-shadow'>
					Chinese Dictionary
				</h1>
				<div className='mb-6 flex flex-wrap gap-2'>
					<input
						className='flex-grow rounded border border-white/40 bg-white/80 px-4 py-2 text-gray-900 placeholder-gray-500'
						onChange={e => setQuery(e.target.value)}
						placeholder='Type hanzi, pinyin or English...'
						value={query}
					/>
					<button
						className='rounded bg-blue-500/90 px-4 py-2 font-medium text-white hover:bg-blue-600'
						onClick={onSearch}
						type='button'
					>
						Search
					</button>
				</div>
				<ul className='space-y-2'>
					{results.map(entries => (
						<li key={entries[0]?.simplified}>
							<TransitionLink
								className='font-medium underline decoration-dotted hover:text-blue-200'
								to={`/${entries[0]?.simplified}`}
							>
								{entries[0]?.simplified} - {entries[0]?.pinyin} -{' '}
								{entries[0]?.definition}
							</TransitionLink>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
