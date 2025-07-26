import {CreateListModal} from 'components/CreateListModal'
import {Head} from 'components/Head'
import {PersonalListCard} from 'components/PersonalListCard'
import {WordCard} from 'components/WordCard'
import {useEffect, useState} from 'react'
import {Link} from 'react-router'
import {
	createPersonalList,
	getLearnedWords,
	getLearningWords,
	getPersonalLists,
	type PersonalList
} from 'utils/storage'

export function Lists() {
	const [personalLists, setPersonalLists] = useState<PersonalList[]>([])
	const [learnedWords, setLearnedWords] = useState<string[]>([])
	const [learningWords, setLearningWords] = useState<string[]>([])
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [activeTab, setActiveTab] = useState<'lists' | 'learning' | 'learned'>(
		'lists'
	)

	useEffect(() => {
		loadData()
	}, [])

	const loadData = () => {
		setPersonalLists(getPersonalLists())
		setLearnedWords(getLearnedWords())
		setLearningWords(getLearningWords())
	}

	const handleCreateList = (name: string) => {
		createPersonalList(name)
		loadData()
		setShowCreateModal(false)
	}

	const handleListUpdate = () => {
		loadData()
	}

	const renderTabContent = () => {
		switch (activeTab) {
			case 'lists':
				return (
					<div>
						<div className='mb-6 flex items-center justify-between'>
							<h2 className='font-semibold text-gray-800 text-xl dark:text-white'>
								My Custom Lists ({personalLists.length})
							</h2>
							<button
								className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
								onClick={() => setShowCreateModal(true)}
							>
								Create New List
							</button>
						</div>

						{personalLists.length === 0 ? (
							<div className='py-12 text-center'>
								<div className='mb-4 text-6xl text-gray-400 dark:text-gray-500'>
									📝
								</div>
								<h3 className='mb-2 font-medium text-gray-800 text-lg dark:text-white'>
									No custom lists yet
								</h3>
								<p className='mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400'>
									Create your first custom list to organize characters by theme,
									difficulty, or any way you like.
								</p>
								<button
									className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
									onClick={() => setShowCreateModal(true)}
								>
									Create Your First List
								</button>
							</div>
						) : (
							<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
								{personalLists.map(list => (
									<PersonalListCard
										key={list.id}
										list={list}
										onUpdate={handleListUpdate}
									/>
								))}
							</div>
						)}
					</div>
				)

			case 'learning':
				return (
					<div>
						<h2 className='mb-6 font-semibold text-gray-800 text-xl dark:text-white'>
							Currently Learning ({learningWords.length})
						</h2>

						{learningWords.length === 0 ? (
							<div className='py-12 text-center'>
								<div className='mb-4 text-6xl text-gray-400 dark:text-gray-500'>
									📚
								</div>
								<h3 className='mb-2 font-medium text-gray-800 text-lg dark:text-white'>
									No words in learning list
								</h3>
								<p className='mb-6 text-gray-600 dark:text-gray-400'>
									Start searching for characters and add them to your learning
									list!
								</p>
								<Link
									className='inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
									to='/search'
								>
									Start Learning
								</Link>
							</div>
						) : (
							<div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
								{learningWords.map((word, index) => (
									<WordCard
										key={`${word}-${index}`}
										onUpdate={handleListUpdate}
										status='learning'
										word={word}
									/>
								))}
							</div>
						)}
					</div>
				)

			case 'learned':
				return (
					<div>
						<h2 className='mb-6 font-semibold text-gray-800 text-xl dark:text-white'>
							Learned Words ({learnedWords.length})
						</h2>

						{learnedWords.length === 0 ? (
							<div className='py-12 text-center'>
								<div className='mb-4 text-6xl text-gray-400 dark:text-gray-500'>
									🎉
								</div>
								<h3 className='mb-2 font-medium text-gray-800 text-lg dark:text-white'>
									No learned words yet
								</h3>
								<p className='mb-6 text-gray-600 dark:text-gray-400'>
									As you study and master characters, mark them as learned to
									track your progress!
								</p>
								<Link
									className='inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700'
									to='/search'
								>
									Start Learning
								</Link>
							</div>
						) : (
							<div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
								{learnedWords.map((word, index) => (
									<WordCard
										key={`${word}-${index}`}
										onUpdate={handleListUpdate}
										status='learned'
										word={word}
									/>
								))}
							</div>
						)}
					</div>
				)

			default:
				return null
		}
	}

	return (
		<>
			<Head title='My Learning Lists' />
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<div className='container mx-auto px-4 py-8'>
					{/* Header */}
					<header className='mb-8'>
						<div className='mb-6 flex items-center justify-between'>
							<Link
								className='flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
								to='/'
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
								Back to Home
							</Link>
							<Link
								className='rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'
								to='/search'
							>
								Search Dictionary
							</Link>
						</div>

						<h1 className='mb-6 font-bold text-3xl text-gray-800 dark:text-white'>
							My Learning Lists
						</h1>

						{/* Tabs */}
						<div className='border-gray-200 border-b dark:border-gray-700'>
							<nav className='-mb-px flex space-x-8'>
								{[
									{
										key: 'lists',
										label: 'Custom Lists',
										count: personalLists.length
									},
									{
										key: 'learning',
										label: 'Learning',
										count: learningWords.length
									},
									{key: 'learned', label: 'Learned', count: learnedWords.length}
								].map(tab => (
									<button
										className={`border-b-2 px-1 py-2 font-medium text-sm transition-colors ${
											activeTab === tab.key
												? 'border-blue-500 text-blue-600 dark:text-blue-400'
												: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
										}`}
										key={tab.key}
										onClick={() => setActiveTab(tab.key as typeof activeTab)}
									>
										{tab.label} ({tab.count})
									</button>
								))}
							</nav>
						</div>
					</header>

					{/* Tab Content */}
					<div className='mt-8'>{renderTabContent()}</div>
				</div>
			</div>

			{/* Create List Modal */}
			{showCreateModal && (
				<CreateListModal
					onClose={() => setShowCreateModal(false)}
					onCreate={handleCreateList}
				/>
			)}
		</>
	)
}
