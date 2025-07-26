import {useSuspenseQuery} from '@tanstack/react-query'
import {getCharacterData} from 'api/dictionary'
import {AudioPlayer} from 'components/AudioPlayer'
import {CharacterInfo} from 'components/CharacterInfo'
import {ExampleSentences} from 'components/ExampleSentences'
import {HanziDisplay} from 'components/HanziDisplay'
import {Head} from 'components/Head'
import {RadicalsList} from 'components/RadicalsList'
import {useCallback, useState} from 'react'
import {Link, Navigate, useParams} from 'react-router'
import {
	addToLearned,
	addToLearning,
	isWordLearned,
	isWordLearning,
	removeFromLearning
} from 'utils/storage'

export function Character() {
	const {word} = useParams()

	if (!word) {
		return <Navigate replace={true} to='/' />
	}

	const {data: characterData} = useSuspenseQuery({
		queryKey: ['character', word],
		queryFn: () => getCharacterData(word),
		retry: false
	})

	const [learned, setLearned] = useState(isWordLearned(word))
	const [learning, setLearning] = useState(isWordLearning(word))

	const handleToggleLearning = useCallback(() => {
		if (learning) {
			removeFromLearning(word)
			setLearning(false)
		} else {
			addToLearning(word)
			setLearning(true)
		}
	}, [word, learning])

	const handleMarkLearned = useCallback(() => {
		addToLearned(word)
		setLearned(true)
		setLearning(false)
	}, [word])

	const primaryEntry = characterData.entries[0]
	const isMultiCharacter = word.length > 1

	return (
		<>
			<Head
				title={`${word} - ${primaryEntry?.definitions[0] || 'Chinese Dictionary'}`}
			/>
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto px-4 py-8'>
					{/* Header */}
					<header className='mb-8'>
						<div className='mb-6 flex items-center justify-between'>
							<Link
								className='flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
								to='/search'
							>
								<svg
									className='mr-2 h-5 w-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										d='M15 19l-7-7 7-7'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
									/>
								</svg>
								Back to Search
							</Link>

							<div className='flex items-center space-x-3'>
								{/* Learning Status Buttons */}
								<button
									className={`rounded-lg px-4 py-2 font-medium transition-colors ${
										learning
											? 'bg-blue-600 text-white hover:bg-blue-700'
											: 'bg-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-700 dark:text-gray-200'
									}`}
									onClick={handleToggleLearning}
								>
									{learning ? 'Learning ✓' : 'Add to Learning'}
								</button>

								{!learned && (
									<button
										className='rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700'
										onClick={handleMarkLearned}
									>
										Mark as Learned
									</button>
								)}

								{learned && (
									<span className='rounded-lg bg-green-100 px-4 py-2 font-medium text-green-800 dark:bg-green-900 dark:text-green-200'>
										Learned ✓
									</span>
								)}
							</div>
						</div>
					</header>

					{/* Main Content */}
					<div className='grid gap-8 lg:grid-cols-2'>
						{/* Left Column - Character Display */}
						<div className='space-y-8'>
							<HanziDisplay character={word} />

							{/* Audio Section */}
							<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
								<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
									Pronunciation
								</h3>
								<AudioPlayer character={word} pinyin={primaryEntry?.pinyin} />
							</div>

							{/* Radicals Section */}
							{characterData.radicals.length > 0 && (
								<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
									<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
										Related Radicals & Components
									</h3>
									<RadicalsList radicals={characterData.radicals} />
								</div>
							)}
						</div>

						{/* Right Column - Character Info */}
						<div className='space-y-8'>
							<CharacterInfo characterData={characterData} />

							{/* Example Sentences */}
							<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
								<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
									Example Sentences
								</h3>
								<ExampleSentences character={word} />
							</div>
						</div>
					</div>

					{/* Multi-Character Breakdown */}
					{isMultiCharacter && (
						<div className='mt-12'>
							<h2 className='mb-6 font-bold text-2xl text-gray-800 dark:text-white'>
								Character Breakdown
							</h2>
							<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
								{Array.from(word).map((char, index) => (
									<Link
										className='group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800'
										key={`${char}-${index}`}
										to={`/character/${char}`}
									>
										<div className='text-center'>
											<div className='mb-2 font-bold text-4xl transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400'>
												{char}
											</div>
											<div className='text-gray-600 text-sm dark:text-gray-400'>
												Click to view details
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
