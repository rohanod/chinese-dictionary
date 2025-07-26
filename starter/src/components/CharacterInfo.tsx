import {type CharacterData} from 'api/dictionary'

export interface CharacterInfoProps {
	characterData: CharacterData
}

export function CharacterInfo({ characterData }: CharacterInfoProps) {
	const primaryEntry = characterData.entries[0]
	
	if (!primaryEntry) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
				<p className="text-gray-600 dark:text-gray-400">No character information available.</p>
			</div>
		)
	}

	const getFrequencyInfo = (entry: typeof primaryEntry) => {
		if (!entry.statistics) return null

		const movieRank = entry.statistics.movieWordRank
		const bookRank = entry.statistics.bookWordRank
		const hskLevel = entry.statistics.hskLevel

		let frequency = 'Unknown'
		let color = 'text-gray-500'

		if (movieRank && movieRank <= 100) {
			frequency = 'Very Common'
			color = 'text-green-600'
		} else if (movieRank && movieRank <= 1000) {
			frequency = 'Common'
			color = 'text-blue-600'
		} else if (movieRank && movieRank <= 5000) {
			frequency = 'Moderate'
			color = 'text-yellow-600'
		} else if (movieRank) {
			frequency = 'Rare'
			color = 'text-red-600'
		}

		return { frequency, color, movieRank, bookRank, hskLevel }
	}

	const frequencyInfo = getFrequencyInfo(primaryEntry)

	const getLiteralTranslation = (entry: typeof primaryEntry) => {
		if (!entry.simpEtymology?.definition) return null
		return entry.simpEtymology.definition
	}

	const getComponentInfo = (entry: typeof primaryEntry) => {
		if (!entry.simpEtymology?.components) return []
		
		return entry.simpEtymology.components.map(comp => ({
			character: comp.char,
			type: comp.type,
			description: getComponentDescription(comp.type)
		}))
	}

	const getComponentDescription = (type: string) => {
		switch (type) {
			case 'meaning':
				return 'Provides meaning/semantic clue'
			case 'sound':
				return 'Provides phonetic/sound clue'
			case 'iconic':
				return 'Pictographic representation'
			case 'simplified':
				return 'Simplified form component'
			case 'deleted':
				return 'Deleted in simplification'
			default:
				return 'Component'
		}
	}

	const componentInfo = getComponentInfo(primaryEntry)

	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
					Basic Information
				</h3>
				
				<div className="space-y-4">
					{/* Character and Pinyin */}
					<div>
						<div className="flex items-baseline space-x-4 mb-2">
							<span className="text-4xl font-bold text-gray-800 dark:text-white">
								{characterData.character}
							</span>
							<span className="text-xl text-blue-600 dark:text-blue-400 font-medium">
								{primaryEntry.pinyin}
							</span>
						</div>
						{primaryEntry.trad !== primaryEntry.simp && (
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Traditional: {primaryEntry.trad}
							</p>
						)}
						{primaryEntry.searchablePinyin !== primaryEntry.pinyin && (
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Searchable: {primaryEntry.searchablePinyin}
							</p>
						)}
					</div>

					{/* Primary Definitions */}
					<div>
						<h4 className="font-medium text-gray-800 dark:text-white mb-2">English Definitions:</h4>
						<ul className="space-y-1">
							{primaryEntry.definitions.map((def, index) => (
								<li key={index} className="text-gray-600 dark:text-gray-300">
									<span className="inline-block w-6 text-gray-400">{index + 1}.</span>
									{def}
								</li>
							))}
						</ul>
					</div>

					{/* Literal Translation */}
					{getLiteralTranslation(primaryEntry) && (
						<div>
							<h4 className="font-medium text-gray-800 dark:text-white mb-2">Literal Meaning:</h4>
							<p className="text-gray-600 dark:text-gray-300 italic">
								{getLiteralTranslation(primaryEntry)}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Frequency and Statistics */}
			{frequencyInfo && (
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
						Usage Statistics
					</h3>
					
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<h4 className="font-medium text-gray-800 dark:text-white mb-2">Frequency</h4>
							<p className={`font-medium ${frequencyInfo.color}`}>
								{frequencyInfo.frequency}
							</p>
							{frequencyInfo.movieRank && (
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Rank #{frequencyInfo.movieRank} in movies
								</p>
							)}
							{frequencyInfo.bookRank && (
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Rank #{frequencyInfo.bookRank} in books
								</p>
							)}
						</div>
						
						{frequencyInfo.hskLevel && (
							<div>
								<h4 className="font-medium text-gray-800 dark:text-white mb-2">HSK Level</h4>
								<span className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1 rounded-full font-medium">
									HSK {frequencyInfo.hskLevel}
								</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Etymology and Components */}
			{(primaryEntry.simpEtymology || componentInfo.length > 0) && (
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
						Etymology & Components
					</h3>
					
					{primaryEntry.simpEtymology?.notes && (
						<div className="mb-4">
							<h4 className="font-medium text-gray-800 dark:text-white mb-2">Etymology:</h4>
							<p className="text-gray-600 dark:text-gray-300">
								{primaryEntry.simpEtymology.notes}
							</p>
						</div>
					)}

					{componentInfo.length > 0 && (
						<div>
							<h4 className="font-medium text-gray-800 dark:text-white mb-2">Components:</h4>
							<div className="space-y-2">
								{componentInfo.map((comp, index) => (
									<div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
										<span className="text-xl font-bold text-gray-800 dark:text-white">
											{comp.character}
										</span>
										<div className="flex-1">
											<span className="text-sm font-medium text-gray-800 dark:text-white capitalize">
												{comp.type}:
											</span>
											<span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
												{comp.description}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Multiple Entries/Pronunciations */}
			{characterData.entries.length > 1 && (
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
					<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
						Alternative Pronunciations
					</h3>
					
					<div className="space-y-4">
						{characterData.entries.slice(1).map((entry, index) => (
							<div key={index} className="border-l-4 border-blue-500 pl-4">
								<div className="flex items-center space-x-4 mb-2">
									<span className="text-xl font-bold text-blue-600 dark:text-blue-400">
										{entry.pinyin}
									</span>
									{entry.statistics?.pinyinFrequency && (
										<span className="text-sm text-gray-500 dark:text-gray-400">
											Frequency: {entry.statistics.pinyinFrequency}
										</span>
									)}
								</div>
								<ul className="space-y-1">
									{entry.definitions.map((def, defIndex) => (
										<li key={defIndex} className="text-gray-600 dark:text-gray-300 text-sm">
											<span className="inline-block w-4 text-gray-400">{defIndex + 1}.</span>
											{def}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}