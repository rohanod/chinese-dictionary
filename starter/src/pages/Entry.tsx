import HanziWriter from 'hanzi-writer'
import {useEffect, useRef} from 'react'
import {useParams} from 'react-router'
import {
	type DefinitionEntry,
	decompose,
	frequency,
	lookup
} from '../api/dictionary'
import {TransitionLink} from '../components/TransitionLink'
import {useList} from '../utils/useList'

export function Entry() {
	const {word} = useParams()
	const writerRef = useRef<HTMLDivElement>(null)
	const {add} = useList('learned')
	const data: DefinitionEntry[] = lookup(word ?? '')
	const first = data[0]
	const radicals = decompose(word ?? '').components
	const freq = frequency(word ?? '')

	useEffect(() => {
		if (writerRef.current && word) {
			const writer = HanziWriter.create(writerRef.current, word, {
				width: 100,
				height: 100,
				showOutline: true,
				showCharacter: true
			})
			writer.animateCharacter()
		}
	}, [word])

	if (!first) {
		return (
			<div className='p-4'>
				<TransitionLink to='/'>Back</TransitionLink>
				<p>No entry found.</p>
			</div>
		)
	}
	return (
		<div className='p-4'>
			<TransitionLink className='text-blue-600 underline' to='/'>
				Back
			</TransitionLink>
			<h1 className='my-4 font-bold text-3xl'>{first.simplified}</h1>
			<button
				className='mb-4 rounded bg-green-500 px-2 py-1 text-white'
				onClick={() => word && add(word)}
				type='button'
			>
				Save to My List
			</button>
			<div className='mb-4' ref={writerRef} />
			<p>Pinyin: {first.pinyin}</p>
			<p>Meaning: {first.definition}</p>
			{freq && <p>Frequency rank: {freq.number}</p>}
			{radicals && (
				<div className='mt-4'>
					<h2 className='font-bold'>Radicals:</h2>
					<ul className='list-inside list-disc'>
						{radicals.map((r: string) => (
							<li key={r}>
								<TransitionLink to={`/${r}`}>{r}</TransitionLink>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
