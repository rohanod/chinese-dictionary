import {useState} from 'react'

export interface CreateListModalProps {
	onClose: () => void
	onCreate: (name: string) => void
}

export function CreateListModal({ onClose, onCreate }: CreateListModalProps) {
	const [listName, setListName] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (listName.trim()) {
			onCreate(listName.trim())
		}
	}

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			onClick={handleBackdropClick}
		>
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
					Create New List
				</h3>
				
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="listName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							List Name
						</label>
						<input
							type="text"
							id="listName"
							value={listName}
							onChange={(e) => setListName(e.target.value)}
							placeholder="Enter list name (e.g., HSK Level 1, Food Words)"
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							maxLength={50}
							required
							autoFocus
						/>
						<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{listName.length}/50 characters
						</div>
					</div>
					
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!listName.trim()}
							className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
						>
							Create List
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}