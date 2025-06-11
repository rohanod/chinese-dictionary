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
			<div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 p-4 text-white'>
				<div className='mx-auto max-w-xl rounded-xl bg-white/20 p-6 shadow-lg backdrop-blur'>
					<TransitionLink className='underline' to='/'>
						Back
					</TransitionLink>
					<p className='mt-4'>No entry found.</p>
				</div>
			</div>
		)
	}
	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 p-4 text-white'>
			<div className='mx-auto max-w-xl rounded-xl bg-white/20 p-6 shadow-lg backdrop-blur'>
				<TransitionLink className='underline' to='/'>
					Back
				</TransitionLink>
				<h1 className='my-4 text-center font-extrabold text-5xl drop-shadow'>
					{first.simplified}
				</h1>
				<button
					className='mb-4 rounded bg-green-500/90 px-3 py-1 font-medium text-white hover:bg-green-600'
					onClick={() => word && add(word)}
					type='button'
				>
					Save to My List
				</button>
				<div className='mx-auto mb-4 flex justify-center' ref={writerRef} />
				<p className='mb-1'>Pinyin: {first.pinyin}</p>
				<p className='mb-1'>Meaning: {first.definition}</p>
				{freq && <p className='mb-1'>Frequency rank: {freq.number}</p>}
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
		</div>
	)
}
