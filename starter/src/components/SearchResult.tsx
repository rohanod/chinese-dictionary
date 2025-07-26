import type {DictionaryEntry} from 'api/dictionary'
import {useCallback, useState} from 'react'
import {Link} from 'react-router'
import {
	addToLearned,
	addToLearning,
	isWordLearned,
	isWordLearning,
	removeFromLearning
} from 'utils/storage'

export interface SearchResultProps {
	entry: DictionaryEntry
}

export function SearchResult({entry}: SearchResultProps) {
	const [learned, setLearned] = useState(isWordLearned(entry.simp))
	const [learning, setLearning] = useState(isWordLearning(entry.simp))

	const handleToggleLearning = useCallback(() => {
		if (learning) {
			removeFromLearning(entry.simp)
			setLearning(false)
		} else {
			addToLearning(entry.simp)
			setLearning(true)
		}
	}, [entry.simp, learning])

	const handleMarkLearned = useCallback(() => {
		addToLearned(entry.simp)
		setLearned(true)
		setLearning(false)
	}, [entry.simp])

	const getFrequencyLabel = (rank?: number) => {
		if (!rank) {
			return 'Unknown'
		}
		if (rank <= 100) {
			return 'Very Common'
		}
		if (rank <= 1000) {
			return 'Common'
		}
		if (rank <= 5000) {
			return 'Moderate'
		}
		return 'Rare'
	}

	const getFrequencyColor = (rank?: number) => {
		if (!rank) {
			return 'text-gray-500'
		}
		if (rank <= 100) {
			return 'text-green-600'
		}
		if (rank <= 1000) {
			return 'text-blue-600'
		}
		if (rank <= 5000) {
			return 'text-yellow-600'
		}
		return 'text-red-600'
	}

	return (
		<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'>
			<div className='mb-4 flex items-start justify-between'>
				<Link
					className='group flex items-center'
					to={`/character/${entry.simp}`}
				>
					<div className='mr-4 font-bold text-3xl transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400'>
						{entry.simp}
					</div>
					<div>
						<div className='font-medium text-blue-600 text-lg group-hover:underline dark:text-blue-400'>
							{entry.pinyin}
						</div>
						{entry.trad !== entry.simp && (
							<div className='text-gray-500 text-sm dark:text-gray-400'>
								Traditional: {entry.trad}
							</div>
						)}
					</div>
				</Link>

				<div className='flex items-center space-x-2'>
					{/* Learning Status Buttons */}
					<button
						className={`rounded-full px-3 py-1 font-medium text-xs transition-colors ${
							learning
								? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
								: 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-700 dark:text-gray-200'
						}`}
						onClick={handleToggleLearning}
					>
						{learning ? 'Learning' : 'Add to Learning'}
					</button>

					{!learned && (
						<button
							className='rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-800 text-xs transition-colors hover:bg-green-100 hover:text-green-800 dark:bg-gray-700 dark:text-gray-200'
							onClick={handleMarkLearned}
						>
							Mark Learned
						</button>
					)}

					{learned && (
						<span className='rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-xs dark:bg-green-900 dark:text-green-200'>
							Learned ✓
						</span>
					)}
				</div>
			</div>

			{/* Definitions */}
			<div className='mb-4'>
				<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
					Definitions:
				</h4>
				<ul className='space-y-1'>
					{entry.definitions.slice(0, 3).map((def, index) => (
						<li
							className='text-gray-600 text-sm dark:text-gray-300'
							key={index}
						>
							<span className='inline-block w-4 text-gray-400'>
								{index + 1}.
							</span>
							{def}
						</li>
					))}
					{entry.definitions.length > 3 && (
						<li className='text-gray-500 text-sm italic dark:text-gray-400'>
							+ {entry.definitions.length - 3} more definitions...
						</li>
					)}
				</ul>
			</div>

			{/* Additional Info */}
			<div className='flex flex-wrap gap-4 text-gray-500 text-xs dark:text-gray-400'>
				{entry.statistics?.hskLevel && (
					<span className='rounded bg-purple-100 px-2 py-1 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
						HSK {entry.statistics.hskLevel}
					</span>
				)}

				{entry.statistics?.movieWordRank && (
					<span
						className={`rounded px-2 py-1 ${getFrequencyColor(entry.statistics.movieWordRank)}`}
					>
						{getFrequencyLabel(entry.statistics.movieWordRank)} (#
						{entry.statistics.movieWordRank})
					</span>
				)}

				{entry.simpEtymology?.components &&
					entry.simpEtymology.components.length > 0 && (
						<span className='text-gray-600 dark:text-gray-400'>
							Contains {entry.simpEtymology.components.length} component
							{entry.simpEtymology.components.length !== 1 ? 's' : ''}
						</span>
					)}
			</div>
		</div>
	)
}
