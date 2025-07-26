import {useState} from 'react'

export interface CreateListModalProps {
	onClose: () => void
	onCreate: (name: string) => void
}

export function CreateListModal({onClose, onCreate}: CreateListModalProps) {
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
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
			onClick={handleBackdropClick}
		>
			<div className='w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800'>
				<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
					Create New List
				</h3>

				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							className='mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300'
							htmlFor='listName'
						>
							List Name
						</label>
						<input
							className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
							id='listName'
							maxLength={50}
							onChange={e => setListName(e.target.value)}
							placeholder='Enter list name (e.g., HSK Level 1, Food Words)'
							required={true}
							type='text'
							value={listName}
						/>
						<div className='mt-1 text-gray-500 text-xs dark:text-gray-400'>
							{listName.length}/50 characters
						</div>
					</div>

					<div className='flex justify-end space-x-3'>
						<button
							className='px-4 py-2 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
							onClick={onClose}
							type='button'
						>
							Cancel
						</button>
						<button
							className='rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
							disabled={!listName.trim()}
							type='submit'
						>
							Create List
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
