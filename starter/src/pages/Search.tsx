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
	const initialType = (searchParams.get('type') as 'pinyin' | 'hanzi' | 'english') || 'pinyin'
	
	const [currentQuery, setCurrentQuery] = useState(initialQuery)
	const [currentType, setCurrentType] = useState(initialType)

	const {data: results} = useSuspenseQuery({
		queryKey: ['search', currentQuery, currentType],
		queryFn: () => currentQuery ? searchDictionary({ 
			query: currentQuery, 
			type: currentType, 
			limit: 20 
		}) : Promise.resolve([])
	})

	const handleSearch = useCallback((query: string, type: 'pinyin' | 'hanzi' | 'english') => {
		setCurrentQuery(query)
		setCurrentType(type)
	}, [])

	return (
		<>
			<Head title={currentQuery ? `Search: ${currentQuery}` : 'Search'} />
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
								to="/lists"
								className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
							>
								My Lists
							</Link>
						</div>
						
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
							Search Chinese Dictionary
						</h1>
						
						<div className="max-w-2xl">
							<SearchBox 
								onSearch={handleSearch} 
								showTypeSelector={true} 
								initialValue={currentQuery}
								initialType={currentType}
							/>
						</div>
					</header>

					{/* Search Results */}
					{currentQuery && (
						<div className="mb-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-800 dark:text-white">
									Search Results for "{currentQuery}" ({currentType})
								</h2>
								<span className="text-gray-600 dark:text-gray-400">
									{results.length} result{results.length !== 1 ? 's' : ''}
								</span>
							</div>

							{results.length === 0 ? (
								<div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
									<div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">🔍</div>
									<h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
										No results found
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										Try adjusting your search term or switching to a different search type.
									</p>
									<div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
										<p>• For Pinyin: Try without tone marks (e.g., "nihao" instead of "nǐhǎo")</p>
										<p>• For Hanzi: Make sure you're using the correct characters</p>
										<p>• For English: Try simpler or more common words</p>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{results.map((entry, index) => (
										<SearchResult key={`${entry.simp}-${index}`} entry={entry} />
									))}
								</div>
							)}
						</div>
					)}

					{!currentQuery && (
						<div className="text-center py-16">
							<div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
							<h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
								Start Your Search
							</h2>
							<p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
								Enter a Chinese character, pinyin, or English word above to begin searching the dictionary.
							</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}