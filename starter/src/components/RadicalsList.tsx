import {Link} from 'react-router'

export interface RadicalsListProps {
	radicals: string[]
}

export function RadicalsList({ radicals }: RadicalsListProps) {
	if (radicals.length === 0) {
		return (
			<p className="text-gray-600 dark:text-gray-400">
				No radicals information available for this character.
			</p>
		)
	}

	return (
		<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
			{radicals.map((radical, index) => (
				<Link
					key={`${radical}-${index}`}
					to={`/character/${radical}`}
					className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-blue-50 dark:hover:bg-blue-900 hover:shadow-md transition-all duration-200"
				>
					<div className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						{radical}
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400 mt-1 group-hover:text-blue-500 transition-colors">
						View details
					</div>
				</Link>
			))}
		</div>
	)
}