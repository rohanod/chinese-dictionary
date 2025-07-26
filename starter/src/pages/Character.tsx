import {useSuspenseQuery} from '@tanstack/react-query'
import {getCharacterData} from 'api/dictionary'
import {Head} from 'components/Head'
import {HanziDisplay} from 'components/HanziDisplay'
import {CharacterInfo} from 'components/CharacterInfo'
import {RadicalsList} from 'components/RadicalsList'
import {ExampleSentences} from 'components/ExampleSentences'
import {AudioPlayer} from 'components/AudioPlayer'
import {Link, Navigate, useParams} from 'react-router'
import {isWordLearned, isWordLearning, addToLearning, addToLearned, removeFromLearning} from 'utils/storage'
import {useState, useCallback} from 'react'

export function Character() {
	const {word} = useParams()
	
	if (!word) {
		return <Navigate replace={true} to="/" />
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
			<Head title={`${word} - ${primaryEntry?.definitions[0] || 'Chinese Dictionary'}`} />
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<header className="mb-8">
						<div className="flex items-center justify-between mb-6">
							<Link
								to="/search"
								className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
								Back to Search
							</Link>
							
							<div className="flex items-center space-x-3">
								{/* Learning Status Buttons */}
								<button
									onClick={handleToggleLearning}
									className={`px-4 py-2 rounded-lg font-medium transition-colors ${
										learning 
											? 'bg-blue-600 text-white hover:bg-blue-700' 
											: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-800'
									}`}
								>
									{learning ? 'Learning ✓' : 'Add to Learning'}
								</button>
								
								{!learned && (
									<button
										onClick={handleMarkLearned}
										className="px-4 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
									>
										Mark as Learned
									</button>
								)}
								
								{learned && (
									<span className="px-4 py-2 rounded-lg font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
										Learned ✓
									</span>
								)}
							</div>
						</div>
					</header>

					{/* Main Content */}
					<div className="grid lg:grid-cols-2 gap-8">
						{/* Left Column - Character Display */}
						<div className="space-y-8">
							<HanziDisplay character={word} />
							
							{/* Audio Section */}
							<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
									Pronunciation
								</h3>
								<AudioPlayer character={word} pinyin={primaryEntry?.pinyin} />
							</div>

							{/* Radicals Section */}
							{characterData.radicals.length > 0 && (
								<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
									<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
										Related Radicals & Components
									</h3>
									<RadicalsList radicals={characterData.radicals} />
								</div>
							)}
						</div>

						{/* Right Column - Character Info */}
						<div className="space-y-8">
							<CharacterInfo characterData={characterData} />
							
							{/* Example Sentences */}
							<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
								<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
									Example Sentences
								</h3>
								<ExampleSentences character={word} />
							</div>
						</div>
					</div>

					{/* Multi-Character Breakdown */}
					{isMultiCharacter && (
						<div className="mt-12">
							<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
								Character Breakdown
							</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{Array.from(word).map((char, index) => (
									<Link
										key={`${char}-${index}`}
										to={`/character/${char}`}
										className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
									>
										<div className="text-center">
											<div className="text-4xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
												{char}
											</div>
											<div className="text-sm text-gray-600 dark:text-gray-400">
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