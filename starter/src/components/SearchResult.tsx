import {type DictionaryEntry} from 'api/dictionary'
import {Link} from 'react-router'
import {isWordLearned, isWordLearning, addToLearning, addToLearned, removeFromLearning} from 'utils/storage'
import {useState, useCallback} from 'react'

export interface SearchResultProps {
	entry: DictionaryEntry
}

export function SearchResult({ entry }: SearchResultProps) {
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
		if (!rank) return 'Unknown'
		if (rank <= 100) return 'Very Common'
		if (rank <= 1000) return 'Common'
		if (rank <= 5000) return 'Moderate'
		return 'Rare'
	}

	const getFrequencyColor = (rank?: number) => {
		if (!rank) return 'text-gray-500'
		if (rank <= 100) return 'text-green-600'
		if (rank <= 1000) return 'text-blue-600'
		if (rank <= 5000) return 'text-yellow-600'
		return 'text-red-600'
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
			<div className="flex items-start justify-between mb-4">
				<Link 
					to={`/character/${entry.simp}`}
					className="flex items-center group"
				>
					<div className="text-3xl font-bold mr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						{entry.simp}
					</div>
					<div>
						<div className="text-lg font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
							{entry.pinyin}
						</div>
						{entry.trad !== entry.simp && (
							<div className="text-sm text-gray-500 dark:text-gray-400">
								Traditional: {entry.trad}
							</div>
						)}
					</div>
				</Link>

				<div className="flex items-center space-x-2">
					{/* Learning Status Buttons */}
					<button
						onClick={handleToggleLearning}
						className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
							learning 
								? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
								: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-800'
						}`}
					>
						{learning ? 'Learning' : 'Add to Learning'}
					</button>
					
					{!learned && (
						<button
							onClick={handleMarkLearned}
							className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-green-100 hover:text-green-800 transition-colors"
						>
							Mark Learned
						</button>
					)}
					
					{learned && (
						<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
							Learned ✓
						</span>
					)}
				</div>
			</div>

			{/* Definitions */}
			<div className="mb-4">
				<h4 className="font-medium text-gray-800 dark:text-white mb-2">Definitions:</h4>
				<ul className="space-y-1">
					{entry.definitions.slice(0, 3).map((def, index) => (
						<li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
							<span className="inline-block w-4 text-gray-400">{index + 1}.</span>
							{def}
						</li>
					))}
					{entry.definitions.length > 3 && (
						<li className="text-gray-500 dark:text-gray-400 text-sm italic">
							+ {entry.definitions.length - 3} more definitions...
						</li>
					)}
				</ul>
			</div>

			{/* Additional Info */}
			<div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
				{entry.statistics?.hskLevel && (
					<span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">
						HSK {entry.statistics.hskLevel}
					</span>
				)}
				
				{entry.statistics?.movieWordRank && (
					<span className={`px-2 py-1 rounded ${getFrequencyColor(entry.statistics.movieWordRank)}`}>
						{getFrequencyLabel(entry.statistics.movieWordRank)} (#{entry.statistics.movieWordRank})
					</span>
				)}

				{entry.simpEtymology?.components && entry.simpEtymology.components.length > 0 && (
					<span className="text-gray-600 dark:text-gray-400">
						Contains {entry.simpEtymology.components.length} component{entry.simpEtymology.components.length !== 1 ? 's' : ''}
					</span>
				)}
			</div>
		</div>
	)
}