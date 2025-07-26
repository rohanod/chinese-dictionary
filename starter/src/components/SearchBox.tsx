import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router'

export interface SearchBoxProps {
	onSearch: (query: string, type: 'pinyin' | 'hanzi' | 'english') => void
	showTypeSelector?: boolean
	initialValue?: string
	initialType?: 'pinyin' | 'hanzi' | 'english'
}

export function SearchBox({ 
	onSearch, 
	showTypeSelector = false, 
	initialValue = '', 
	initialType = 'pinyin' 
}: SearchBoxProps) {
	const [query, setQuery] = useState(initialValue)
	const [searchType, setSearchType] = useState<'pinyin' | 'hanzi' | 'english'>(initialType)
	const navigate = useNavigate()

	const handleSearch = useCallback(() => {
		if (query.trim()) {
			onSearch(query.trim(), searchType)
			// Navigate to search results if this is the homepage search
			if (showTypeSelector) {
				navigate(`/search?q=${encodeURIComponent(query.trim())}&type=${searchType}`)
			}
		}
	}, [query, searchType, onSearch, showTypeSelector, navigate])

	const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}, [handleSearch])

	const handleTypeChange = useCallback((newType: 'pinyin' | 'hanzi' | 'english') => {
		setSearchType(newType)
		// Clear the input when switching search types as requested
		setQuery('')
	}, [])

	const getPlaceholder = () => {
		switch (searchType) {
			case 'pinyin':
				return 'Enter pinyin (e.g., nihao, wo ai ni)...'
			case 'hanzi':
				return 'Enter Chinese characters (e.g., 你好, 我爱你)...'
			case 'english':
				return 'Enter English word (e.g., hello, love)...'
			default:
				return 'Search...'
		}
	}

	return (
		<div className="w-full">
			{showTypeSelector && (
				<div className="mb-4">
					<div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
						{(['pinyin', 'hanzi', 'english'] as const).map((type) => (
							<button
								key={type}
								onClick={() => handleTypeChange(type)}
								className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
									searchType === type
										? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
										: 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
								}`}
							>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</button>
						))}
					</div>
				</div>
			)}
			
			<div className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder={getPlaceholder()}
					className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
				/>
				<button
					onClick={handleSearch}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors"
					disabled={!query.trim()}
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>
			</div>
			
			{searchType === 'pinyin' && (
				<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Tip: You don't need to include tone marks. "nihao" will find "nǐhǎo"
				</p>
			)}
		</div>
	)
}