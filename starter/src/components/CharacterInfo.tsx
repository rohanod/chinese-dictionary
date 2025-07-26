import type {CharacterData} from 'api/dictionary'

export interface CharacterInfoProps {
	characterData: CharacterData
}

export function CharacterInfo({characterData}: CharacterInfoProps) {
	const primaryEntry = characterData.entries[0]

	if (!primaryEntry) {
		return (
			<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
				<p className='text-gray-600 dark:text-gray-400'>
					No character information available.
				</p>
			</div>
		)
	}

	const getFrequencyInfo = (entry: typeof primaryEntry) => {
		if (!entry.statistics) {
			return null
		}

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

		return {frequency, color, movieRank, bookRank, hskLevel}
	}

	const frequencyInfo = getFrequencyInfo(primaryEntry)

	const getLiteralTranslation = (entry: typeof primaryEntry) => {
		if (!entry.simpEtymology?.definition) {
			return null
		}
		return entry.simpEtymology.definition
	}

	const getComponentInfo = (entry: typeof primaryEntry) => {
		if (!entry.simpEtymology?.components) {
			return []
		}

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
		<div className='space-y-6'>
			{/* Basic Information */}
			<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
				<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
					Basic Information
				</h3>

				<div className='space-y-4'>
					{/* Character and Pinyin */}
					<div>
						<div className='mb-2 flex items-baseline space-x-4'>
							<span className='font-bold text-4xl text-gray-800 dark:text-white'>
								{characterData.character}
							</span>
							<span className='font-medium text-blue-600 text-xl dark:text-blue-400'>
								{primaryEntry.pinyin}
							</span>
						</div>
						{primaryEntry.trad !== primaryEntry.simp && (
							<p className='text-gray-600 text-sm dark:text-gray-400'>
								Traditional: {primaryEntry.trad}
							</p>
						)}
						{primaryEntry.searchablePinyin !== primaryEntry.pinyin && (
							<p className='text-gray-600 text-sm dark:text-gray-400'>
								Searchable: {primaryEntry.searchablePinyin}
							</p>
						)}
					</div>

					{/* Primary Definitions */}
					<div>
						<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
							English Definitions:
						</h4>
						<ul className='space-y-1'>
							{primaryEntry.definitions.map((def, index) => (
								<li className='text-gray-600 dark:text-gray-300' key={index}>
									<span className='inline-block w-6 text-gray-400'>
										{index + 1}.
									</span>
									{def}
								</li>
							))}
						</ul>
					</div>

					{/* Literal Translation */}
					{getLiteralTranslation(primaryEntry) && (
						<div>
							<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
								Literal Meaning:
							</h4>
							<p className='text-gray-600 italic dark:text-gray-300'>
								{getLiteralTranslation(primaryEntry)}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Frequency and Statistics */}
			{frequencyInfo && (
				<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
					<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
						Usage Statistics
					</h3>

					<div className='grid gap-4 md:grid-cols-2'>
						<div>
							<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
								Frequency
							</h4>
							<p className={`font-medium ${frequencyInfo.color}`}>
								{frequencyInfo.frequency}
							</p>
							{frequencyInfo.movieRank && (
								<p className='text-gray-600 text-sm dark:text-gray-400'>
									Rank #{frequencyInfo.movieRank} in movies
								</p>
							)}
							{frequencyInfo.bookRank && (
								<p className='text-gray-600 text-sm dark:text-gray-400'>
									Rank #{frequencyInfo.bookRank} in books
								</p>
							)}
						</div>

						{frequencyInfo.hskLevel && (
							<div>
								<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
									HSK Level
								</h4>
								<span className='inline-block rounded-full bg-purple-100 px-3 py-1 font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
									HSK {frequencyInfo.hskLevel}
								</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Etymology and Components */}
			{(primaryEntry.simpEtymology || componentInfo.length > 0) && (
				<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
					<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
						Etymology & Components
					</h3>

					{primaryEntry.simpEtymology?.notes && (
						<div className='mb-4'>
							<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
								Etymology:
							</h4>
							<p className='text-gray-600 dark:text-gray-300'>
								{primaryEntry.simpEtymology.notes}
							</p>
						</div>
					)}

					{componentInfo.length > 0 && (
						<div>
							<h4 className='mb-2 font-medium text-gray-800 dark:text-white'>
								Components:
							</h4>
							<div className='space-y-2'>
								{componentInfo.map((comp, index) => (
									<div
										className='flex items-center space-x-3 rounded bg-gray-50 p-2 dark:bg-gray-700'
										key={index}
									>
										<span className='font-bold text-gray-800 text-xl dark:text-white'>
											{comp.character}
										</span>
										<div className='flex-1'>
											<span className='font-medium text-gray-800 text-sm capitalize dark:text-white'>
												{comp.type}:
											</span>
											<span className='ml-1 text-gray-600 text-sm dark:text-gray-300'>
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
				<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
					<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
						Alternative Pronunciations
					</h3>

					<div className='space-y-4'>
						{characterData.entries.slice(1).map((entry, index) => (
							<div className='border-blue-500 border-l-4 pl-4' key={index}>
								<div className='mb-2 flex items-center space-x-4'>
									<span className='font-bold text-blue-600 text-xl dark:text-blue-400'>
										{entry.pinyin}
									</span>
									{entry.statistics?.pinyinFrequency && (
										<span className='text-gray-500 text-sm dark:text-gray-400'>
											Frequency: {entry.statistics.pinyinFrequency}
										</span>
									)}
								</div>
								<ul className='space-y-1'>
									{entry.definitions.map((def, defIndex) => (
										<li
											className='text-gray-600 text-sm dark:text-gray-300'
											key={defIndex}
										>
											<span className='inline-block w-4 text-gray-400'>
												{defIndex + 1}.
											</span>
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
