import {type PersonalList, updatePersonalList, deletePersonalList, addWordToList, removeWordFromList} from 'utils/storage'
import {Link} from 'react-router'
import {useState} from 'react'

export interface PersonalListCardProps {
	list: PersonalList
	onUpdate: () => void
}

export function PersonalListCard({ list, onUpdate }: PersonalListCardProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [editName, setEditName] = useState(list.name)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [newWord, setNewWord] = useState('')
	const [showAddWord, setShowAddWord] = useState(false)

	const handleSaveEdit = () => {
		if (editName.trim() && editName.trim() !== list.name) {
			updatePersonalList(list.id, { name: editName.trim() })
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
		<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				{isEditing ? (
					<div className="flex-1 mr-2">
						<input
							type="text"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							maxLength={50}
							autoFocus
							onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
						/>
						<div className="flex space-x-2 mt-2">
							<button
								onClick={handleSaveEdit}
								className="text-green-600 hover:text-green-700 text-sm"
							>
								Save
							</button>
							<button
								onClick={handleCancelEdit}
								className="text-gray-600 hover:text-gray-700 text-sm"
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<>
						<h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
							{list.name}
						</h3>
						<div className="flex space-x-1 ml-2">
							<button
								onClick={() => setIsEditing(true)}
								className="text-gray-400 hover:text-blue-600 p-1"
								title="Edit list name"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
							</button>
							<button
								onClick={() => setShowDeleteConfirm(true)}
								className="text-gray-400 hover:text-red-600 p-1"
								title="Delete list"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</>
				)}
			</div>

			{/* Word Count and Date */}
			<div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
				<p>{list.words.length} word{list.words.length !== 1 ? 's' : ''}</p>
				<p>Created: {formatDate(list.createdAt)}</p>
				{list.updatedAt !== list.createdAt && (
					<p>Updated: {formatDate(list.updatedAt)}</p>
				)}
			</div>

			{/* Words Preview */}
			<div className="mb-4">
				{list.words.length === 0 ? (
					<p className="text-gray-500 dark:text-gray-400 text-sm italic">
						No words in this list yet
					</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{list.words.slice(0, 8).map((word, index) => (
							<div key={index} className="group relative">
								<Link
									to={`/character/${word}`}
									className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
								>
									{word}
								</Link>
								<button
									onClick={() => handleRemoveWord(word)}
									className="absolute -top-1 -right-1 hidden group-hover:block bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
									title="Remove from list"
								>
									×
								</button>
							</div>
						))}
						{list.words.length > 8 && (
							<span className="text-gray-500 dark:text-gray-400 text-sm">
								+{list.words.length - 8} more
							</span>
						)}
					</div>
				)}
			</div>

			{/* Add Word */}
			<div className="border-t border-gray-200 dark:border-gray-700 pt-4">
				{showAddWord ? (
					<div className="flex space-x-2">
						<input
							type="text"
							value={newWord}
							onChange={(e) => setNewWord(e.target.value)}
							placeholder="Enter Chinese character or word"
							className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
							onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
							autoFocus
						/>
						<button
							onClick={handleAddWord}
							disabled={!newWord.trim()}
							className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
						>
							Add
						</button>
						<button
							onClick={() => {
								setShowAddWord(false)
								setNewWord('')
							}}
							className="text-gray-600 hover:text-gray-700 px-2 py-1 text-sm"
						>
							Cancel
						</button>
					</div>
				) : (
					<button
						onClick={() => setShowAddWord(true)}
						className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded text-sm transition-colors"
					>
						+ Add Word
					</button>
				)}
			</div>

			{/* Delete Confirmation */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
							Delete List
						</h4>
						<p className="text-gray-600 dark:text-gray-400 mb-6">
							Are you sure you want to delete "{list.name}"? This action cannot be undone.
						</p>
						<div className="flex justify-end space-x-3">
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteList}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
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