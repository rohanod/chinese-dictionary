import {Head} from 'components/Head'
import {SearchBox} from 'components/SearchBox'
import {Link} from 'react-router'

export function Home() {
	return (
		<>
			<Head title='Chinese Dictionary' />
			<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
				<div className='container mx-auto px-4 py-8'>
					{/* Header */}
					<header className='mb-12 text-center'>
						<h1 className='mb-4 font-bold text-5xl text-gray-800 dark:text-white'>
							Chinese Dictionary
						</h1>
						<p className='mx-auto max-w-2xl text-gray-600 text-xl dark:text-gray-300'>
							Discover the beauty of Chinese characters with stroke order
							animations, pronunciation guides, and comprehensive definitions.
						</p>
					</header>

					{/* Search Section */}
					<div className='mx-auto mb-16 max-w-2xl'>
						<SearchBox onSearch={() => {}} showTypeSelector={true} />
					</div>

					{/* Features Grid */}
					<div className='mb-16 grid gap-8 md:grid-cols-3'>
						<div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
							<div className='mb-4 text-3xl'>🔍</div>
							<h3 className='mb-2 font-semibold text-gray-800 text-xl dark:text-white'>
								Smart Search
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								Search by Hanzi, Pinyin (with or without tones), or English
								words. Our fuzzy search helps you find what you're looking for.
							</p>
						</div>

						<div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
							<div className='mb-4 text-3xl'>✍️</div>
							<h3 className='mb-2 font-semibold text-gray-800 text-xl dark:text-white'>
								Stroke Order
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								Learn proper stroke order with animated demonstrations and
								step-by-step guides for every character.
							</p>
						</div>

						<div className='rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800'>
							<div className='mb-4 text-3xl'>📚</div>
							<h3 className='mb-2 font-semibold text-gray-800 text-xl dark:text-white'>
								Personal Lists
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								Create custom word lists, track your learning progress, and
								organize characters by difficulty or topic.
							</p>
						</div>
					</div>

					{/* Quick Actions */}
					<div className='space-y-4 text-center'>
						<h2 className='mb-6 font-semibold text-2xl text-gray-800 dark:text-white'>
							Quick Actions
						</h2>
						<div className='flex flex-wrap justify-center gap-4'>
							<Link
								className='rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700'
								to='/search'
							>
								Advanced Search
							</Link>
							<Link
								className='rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700'
								to='/lists'
							>
								My Lists
							</Link>
							<Link
								className='rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700'
								to='/character/你好'
							>
								Try Demo: 你好
							</Link>
						</div>
					</div>

					{/* Popular Characters */}
					<div className='mt-16'>
						<h2 className='mb-6 text-center font-semibold text-2xl text-gray-800 dark:text-white'>
							Popular Characters
						</h2>
						<div className='mx-auto grid max-w-4xl grid-cols-5 gap-4 md:grid-cols-10'>
							{[
								'我',
								'你',
								'他',
								'她',
								'们',
								'是',
								'的',
								'有',
								'在',
								'好',
								'人',
								'大',
								'小',
								'中',
								'国',
								'家',
								'水',
								'火',
								'土',
								'木'
							].map(char => (
								<Link
									className='group rounded-lg bg-white p-4 text-center transition-shadow hover:shadow-lg dark:bg-gray-800'
									key={char}
									to={`/character/${char}`}
								>
									<div className='font-bold text-2xl text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
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
