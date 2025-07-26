import {Head} from 'components/Head'
import {PersonalListCard} from 'components/PersonalListCard'
import {CreateListModal} from 'components/CreateListModal'
import {WordCard} from 'components/WordCard'
import {Link} from 'react-router'
import {useState, useEffect} from 'react'
import {
	getPersonalLists,
	getLearnedWords,
	getLearningWords,
	createPersonalList,
	type PersonalList
} from 'utils/storage'

export function Lists() {
	const [personalLists, setPersonalLists] = useState<PersonalList[]>([])
	const [learnedWords, setLearnedWords] = useState<string[]>([])
	const [learningWords, setLearningWords] = useState<string[]>([])
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [activeTab, setActiveTab] = useState<'lists' | 'learning' | 'learned'>('lists')

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
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-white">
								My Custom Lists ({personalLists.length})
							</h2>
							<button
								onClick={() => setShowCreateModal(true)}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
							>
								Create New List
							</button>
						</div>

						{personalLists.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
								<h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
									No custom lists yet
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
									Create your first custom list to organize characters by theme, difficulty, or any way you like.
								</p>
								<button
									onClick={() => setShowCreateModal(true)}
									className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
								>
									Create Your First List
								</button>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{personalLists.map((list) => (
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
						<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
							Currently Learning ({learningWords.length})
						</h2>

						{learningWords.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
								<h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
									No words in learning list
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-6">
									Start searching for characters and add them to your learning list!
								</p>
								<Link
									to="/search"
									className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
								>
									Start Learning
								</Link>
							</div>
						) : (
							<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								{learningWords.map((word, index) => (
									<WordCard
										key={`${word}-${index}`}
										word={word}
										status="learning"
										onUpdate={handleListUpdate}
									/>
								))}
							</div>
						)}
					</div>
				)

			case 'learned':
				return (
					<div>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
							Learned Words ({learnedWords.length})
						</h2>

						{learnedWords.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🎉</div>
								<h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
									No learned words yet
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-6">
									As you study and master characters, mark them as learned to track your progress!
								</p>
								<Link
									to="/search"
									className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
								>
									Start Learning
								</Link>
							</div>
						) : (
							<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								{learnedWords.map((word, index) => (
									<WordCard
										key={`${word}-${index}`}
										word={word}
										status="learned"
										onUpdate={handleListUpdate}
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
			<Head title="My Learning Lists" />
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<header className="mb-8">
						<div className="flex items-center justify-between mb-6">
							<Link
								to="/"
								className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
								Back to Home
							</Link>
							<Link
								to="/search"
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
							>
								Search Dictionary
							</Link>
						</div>
						
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
							My Learning Lists
						</h1>

						{/* Tabs */}
						<div className="border-b border-gray-200 dark:border-gray-700">
							<nav className="-mb-px flex space-x-8">
								{[
									{ key: 'lists', label: 'Custom Lists', count: personalLists.length },
									{ key: 'learning', label: 'Learning', count: learningWords.length },
									{ key: 'learned', label: 'Learned', count: learnedWords.length }
								].map((tab) => (
									<button
										key={tab.key}
										onClick={() => setActiveTab(tab.key as typeof activeTab)}
										className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
											activeTab === tab.key
												? 'border-blue-500 text-blue-600 dark:text-blue-400'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
										}`}
									>
										{tab.label} ({tab.count})
									</button>
								))}
							</nav>
						</div>
					</header>

					{/* Tab Content */}
					<div className="mt-8">
						{renderTabContent()}
					</div>
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