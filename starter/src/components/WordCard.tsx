import {Link} from 'react-router'
import {
	addToLearned,
	removeFromLearned,
	removeFromLearning
} from 'utils/storage'

export interface WordCardProps {
	word: string
	status: 'learning' | 'learned'
	onUpdate: () => void
}

export function WordCard({word, status, onUpdate}: WordCardProps) {
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
		<div className='group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'>
			<div className='text-center'>
				<Link className='block' to={`/character/${word}`}>
					<div className='mb-2 font-bold text-3xl text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
						{word}
					</div>
				</Link>

				<div className='flex justify-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100'>
					{status === 'learning' && (
						<button
							className='rounded bg-green-600 px-2 py-1 text-white text-xs transition-colors hover:bg-green-700'
							onClick={handleMarkLearned}
							title='Mark as learned'
						>
							✓ Learned
						</button>
					)}

					<button
						className='rounded bg-red-600 px-2 py-1 text-white text-xs transition-colors hover:bg-red-700'
						onClick={handleRemove}
						title={`Remove from ${status}`}
					>
						Remove
					</button>
				</div>

				<div
					className={`mt-2 rounded-full px-2 py-1 text-xs ${
						status === 'learning'
							? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
							: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
					}`}
				>
					{status === 'learning' ? 'Learning' : 'Learned'}
				</div>
			</div>
		</div>
	)
}
