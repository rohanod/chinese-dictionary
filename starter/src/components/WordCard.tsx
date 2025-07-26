import {Link} from 'react-router'
import {removeFromLearned, removeFromLearning, addToLearned} from 'utils/storage'

export interface WordCardProps {
	word: string
	status: 'learning' | 'learned'
	onUpdate: () => void
}

export function WordCard({ word, status, onUpdate }: WordCardProps) {
	const handleRemove = () => {
		if (status === 'learning') {
			removeFromLearning(word)
		} else {
			removeFromLearned(word)
		}
		onUpdate()
	}

	const handleMarkLearned = () => {
		if (status === 'learning') {
			addToLearned(word)
			onUpdate()
		}
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
			<div className="text-center">
				<Link
					to={`/character/${word}`}
					className="block"
				>
					<div className="text-3xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
						{word}
					</div>
				</Link>
				
				<div className="flex justify-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
					{status === 'learning' && (
						<button
							onClick={handleMarkLearned}
							className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
							title="Mark as learned"
						>
							✓ Learned
						</button>
					)}
					
					<button
						onClick={handleRemove}
						className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
						title={`Remove from ${status}`}
					>
						Remove
					</button>
				</div>
				
				<div className={`mt-2 text-xs px-2 py-1 rounded-full ${
					status === 'learning' 
						? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
						: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
				}`}>
					{status === 'learning' ? 'Learning' : 'Learned'}
				</div>
			</div>
		</div>
	)
}