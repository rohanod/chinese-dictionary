import {useState} from 'react'
import {Link} from 'react-router'
import {
	addWordToList,
	deletePersonalList,
	type PersonalList,
	removeWordFromList,
	updatePersonalList
} from 'utils/storage'

export interface PersonalListCardProps {
	list: PersonalList
	onUpdate: () => void
}

export function PersonalListCard({list, onUpdate}: PersonalListCardProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [editName, setEditName] = useState(list.name)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [newWord, setNewWord] = useState('')
	const [showAddWord, setShowAddWord] = useState(false)

	const handleSaveEdit = () => {
		if (editName.trim() && editName.trim() !== list.name) {
			updatePersonalList(list.id, {name: editName.trim()})
			onUpdate()
		}
		setIsEditing(false)
		setEditName(list.name)
	}

	const handleCancelEdit = () => {
		setIsEditing(false)
		setEditName(list.name)
	}

	const handleDeleteList = () => {
		deletePersonalList(list.id)
		onUpdate()
		setShowDeleteConfirm(false)
	}

	const handleAddWord = () => {
		if (newWord.trim()) {
			addWordToList(list.id, newWord.trim())
			setNewWord('')
			setShowAddWord(false)
			onUpdate()
		}
	}

	const handleRemoveWord = (word: string) => {
		removeWordFromList(list.id, word)
		onUpdate()
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString()
	}

	return (
		<div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
			{/* Header */}
			<div className='mb-4 flex items-center justify-between'>
				{isEditing ? (
					<div className='mr-2 flex-1'>
						<input
							className='w-full rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
							maxLength={50}
							onChange={e => setEditName(e.target.value)}
							onKeyPress={e => e.key === 'Enter' && handleSaveEdit()}
							type='text'
							value={editName}
						/>
						<div className='mt-2 flex space-x-2'>
							<button
								className='text-green-600 text-sm hover:text-green-700'
								onClick={handleSaveEdit}
							>
								Save
							</button>
							<button
								className='text-gray-600 text-sm hover:text-gray-700'
								onClick={handleCancelEdit}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<h3 className='truncate font-semibold text-gray-800 text-lg dark:text-white'>
							{list.name}
						</h3>
						<div className='ml-2 flex space-x-1'>
							<button
								className='p-1 text-gray-400 hover:text-blue-600'
								onClick={() => setIsEditing(true)}
								title='Edit list name'
							>
								<svg
									className='h-4 w-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
									/>
								</svg>
							</button>
							<button
								className='p-1 text-gray-400 hover:text-red-600'
								onClick={() => setShowDeleteConfirm(true)}
								title='Delete list'
							>
								<svg
									className='h-4 w-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
									/>
								</svg>
							</button>
						</div>
					</>
				)}
			</div>

			{/* Word Count and Date */}
			<div className='mb-4 text-gray-600 text-sm dark:text-gray-400'>
				<p>
					{list.words.length} word{list.words.length !== 1 ? 's' : ''}
				</p>
				<p>Created: {formatDate(list.createdAt)}</p>
				{list.updatedAt !== list.createdAt && (
					<p>Updated: {formatDate(list.updatedAt)}</p>
				)}
			</div>

			{/* Words Preview */}
			<div className='mb-4'>
				{list.words.length === 0 ? (
					<p className='text-gray-500 text-sm italic dark:text-gray-400'>
						No words in this list yet
					</p>
				) : (
					<div className='flex flex-wrap gap-2'>
						{list.words.slice(0, 8).map((word, index) => (
							<div className='group relative' key={index}>
								<Link
									className='inline-block rounded bg-blue-100 px-2 py-1 text-blue-800 text-sm transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
									to={`/character/${word}`}
								>
									{word}
								</Link>
								<button
									className='-top-1 -right-1 absolute flex hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs group-hover:block'
									onClick={() => handleRemoveWord(word)}
									title='Remove from list'
								>
									×
								</button>
							</div>
						))}
						{list.words.length > 8 && (
							<span className='text-gray-500 text-sm dark:text-gray-400'>
								+{list.words.length - 8} more
							</span>
						)}
					</div>
				)}
			</div>

			{/* Add Word */}
			<div className='border-gray-200 border-t pt-4 dark:border-gray-700'>
				{showAddWord ? (
					<div className='flex space-x-2'>
						<input
							className='flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
							onChange={e => setNewWord(e.target.value)}
							onKeyPress={e => e.key === 'Enter' && handleAddWord()}
							placeholder='Enter Chinese character or word'
							type='text'
							value={newWord}
						/>
						<button
							className='rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
							disabled={!newWord.trim()}
							onClick={handleAddWord}
						>
							Add
						</button>
						<button
							className='px-2 py-1 text-gray-600 text-sm hover:text-gray-700'
							onClick={() => {
								setShowAddWord(false)
								setNewWord('')
							}}
						>
							Cancel
						</button>
					</div>
				) : (
					<button
						className='w-full rounded bg-gray-100 py-2 text-gray-700 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
						onClick={() => setShowAddWord(true)}
					>
						+ Add Word
					</button>
				)}
			</div>

			{/* Delete Confirmation */}
			{showDeleteConfirm && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
					<div className='w-full max-w-sm rounded-lg bg-white p-6 dark:bg-gray-800'>
						<h4 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
							Delete List
						</h4>
						<p className='mb-6 text-gray-600 dark:text-gray-400'>
							Are you sure you want to delete "{list.name}"? This action cannot
							be undone.
						</p>
						<div className='flex justify-end space-x-3'>
							<button
								className='px-4 py-2 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
								onClick={() => setShowDeleteConfirm(false)}
							>
								Cancel
							</button>
							<button
								className='rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700'
								onClick={handleDeleteList}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
