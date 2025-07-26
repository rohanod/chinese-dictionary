import {Head} from 'components/Head'
import {SearchBox} from 'components/SearchBox'
import {Link} from 'react-router'

export function Home() {
	return (
		<>
			<Head title="Chinese Dictionary" />
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<header className="text-center mb-12">
						<h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
							Chinese Dictionary
						</h1>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
							Discover the beauty of Chinese characters with stroke order animations, 
							pronunciation guides, and comprehensive definitions.
						</p>
					</header>

					{/* Search Section */}
					<div className="max-w-2xl mx-auto mb-16">
						<SearchBox onSearch={() => {}} showTypeSelector={true} />
					</div>

					{/* Features Grid */}
					<div className="grid md:grid-cols-3 gap-8 mb-16">
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
							<div className="text-3xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
								Smart Search
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Search by Hanzi, Pinyin (with or without tones), or English words. 
								Our fuzzy search helps you find what you're looking for.
							</p>
						</div>

						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
							<div className="text-3xl mb-4">✍️</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
								Stroke Order
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Learn proper stroke order with animated demonstrations and 
								step-by-step guides for every character.
							</p>
						</div>

						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
							<div className="text-3xl mb-4">📚</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
								Personal Lists
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								Create custom word lists, track your learning progress, and 
								organize characters by difficulty or topic.
							</p>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="text-center space-y-4">
						<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
							Quick Actions
						</h2>
						<div className="flex flex-wrap justify-center gap-4">
							<Link
								to="/search"
								className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
							>
								Advanced Search
							</Link>
							<Link
								to="/lists"
								className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
							>
								My Lists
							</Link>
							<Link
								to="/character/你好"
								className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
							>
								Try Demo: 你好
							</Link>
						</div>
					</div>

					{/* Popular Characters */}
					<div className="mt-16">
						<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
							Popular Characters
						</h2>
						<div className="grid grid-cols-5 md:grid-cols-10 gap-4 max-w-4xl mx-auto">
							{['我', '你', '他', '她', '们', '是', '的', '有', '在', '好', '人', '大', '小', '中', '国', '家', '水', '火', '土', '木'].map((char) => (
								<Link
									key={char}
									to={`/character/${char}`}
									className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-lg transition-shadow group"
								>
									<div className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										{char}
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}