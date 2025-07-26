import {useSuspenseQuery} from '@tanstack/react-query'
import {searchDictionary} from 'api/dictionary'
import {Head} from 'components/Head'
import {SearchBox} from 'components/SearchBox'
import {SearchResult} from 'components/SearchResult'
import {useCallback, useState} from 'react'
import {Link, useSearchParams} from 'react-router'

export function Search() {
	const [searchParams] = useSearchParams()
	const initialQuery = searchParams.get('q') || ''
	const initialType =
		(searchParams.get('type') as 'pinyin' | 'hanzi' | 'english') || 'pinyin'

	const [currentQuery, setCurrentQuery] = useState(initialQuery)
	const [currentType, setCurrentType] = useState(initialType)

	const {data: results} = useSuspenseQuery({
		queryKey: ['search', currentQuery, currentType],
		queryFn: () =>
			currentQuery
				? searchDictionary({
						query: currentQuery,
						type: currentType,
						limit: 20
					})
				: Promise.resolve([])
	})

	const handleSearch = useCallback(
		(query: string, type: 'pinyin' | 'hanzi' | 'english') => {
			setCurrentQuery(query)
			setCurrentType(type)
		},
		[]
	)

	return (
		<>
			<Head title={currentQuery ? `Search: ${currentQuery}` : 'Search'} />
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
								className='rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700'
								to='/lists'
							>
								My Lists
							</Link>
						</div>

						<h1 className='mb-6 font-bold text-3xl text-gray-800 dark:text-white'>
							Search Chinese Dictionary
						</h1>

						<div className='max-w-2xl'>
							<SearchBox
								initialType={currentType}
								initialValue={currentQuery}
								onSearch={handleSearch}
								showTypeSelector={true}
							/>
						</div>
					</header>

					{/* Search Results */}
					{currentQuery && (
						<div className='mb-8'>
							<div className='mb-6 flex items-center justify-between'>
								<h2 className='font-semibold text-gray-800 text-xl dark:text-white'>
									Search Results for "{currentQuery}" ({currentType})
								</h2>
								<span className='text-gray-600 dark:text-gray-400'>
									{results.length} result{results.length !== 1 ? 's' : ''}
								</span>
							</div>

							{results.length === 0 ? (
								<div className='rounded-lg bg-white p-8 text-center dark:bg-gray-800'>
									<div className='mb-4 text-4xl text-gray-400 dark:text-gray-500'>
										🔍
									</div>
									<h3 className='mb-2 font-medium text-gray-800 text-lg dark:text-white'>
										No results found
									</h3>
									<p className='text-gray-600 dark:text-gray-400'>
										Try adjusting your search term or switching to a different
										search type.
									</p>
									<div className='mt-4 space-y-2 text-gray-500 text-sm dark:text-gray-400'>
										<p>
											• For Pinyin: Try without tone marks (e.g., "nihao"
											instead of "nǐhǎo")
										</p>
										<p>
											• For Hanzi: Make sure you're using the correct characters
										</p>
										<p>• For English: Try simpler or more common words</p>
									</div>
								</div>
							) : (
								<div className='space-y-4'>
									{results.map((entry, index) => (
										<SearchResult
											entry={entry}
											key={`${entry.simp}-${index}`}
										/>
									))}
								</div>
							)}
						</div>
					)}

					{!currentQuery && (
						<div className='py-16 text-center'>
							<div className='mb-4 text-6xl text-gray-400 dark:text-gray-500'>
								🔍
							</div>
							<h2 className='mb-4 font-semibold text-2xl text-gray-800 dark:text-white'>
								Start Your Search
							</h2>
							<p className='mx-auto max-w-md text-gray-600 dark:text-gray-400'>
								Enter a Chinese character, pinyin, or English word above to
								begin searching the dictionary.
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
