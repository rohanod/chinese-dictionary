import {Link} from 'react-router'

export interface RadicalsListProps {
	radicals: string[]
}

export function RadicalsList({radicals}: RadicalsListProps) {
	if (radicals.length === 0) {
		return (
			<p className='text-gray-600 dark:text-gray-400'>
				No radicals information available for this character.
			</p>
		)
	}

	return (
		<div className='grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6'>
			{radicals.map((radical, index) => (
				<Link
					className='group rounded-lg bg-gray-50 p-3 text-center transition-all duration-200 hover:bg-blue-50 hover:shadow-md dark:bg-gray-700 dark:hover:bg-blue-900'
					key={`${radical}-${index}`}
					to={`/character/${radical}`}
				>
					<div className='font-bold text-2xl text-gray-800 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
						{radical}
					</div>
					<div className='mt-1 text-gray-500 text-xs transition-colors group-hover:text-blue-500 dark:text-gray-400'>
						View details
					</div>
				</Link>
			))}
		</div>
	)
}
