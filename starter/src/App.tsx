import {LoadingOrError} from 'components/LoadingOrError'
import {Search} from 'pages/Search'
import {lazy, Suspense} from 'react'
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary'
import {Route, Routes} from 'react-router'

const Entry = lazy(async () =>
	import('pages/Entry').then(m => ({default: m.Entry}))
)

function renderError({error}: FallbackProps) {
	return <LoadingOrError error={error} />
}

export function App() {
	return (
		<ErrorBoundary fallbackRender={renderError}>
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route element={<Search />} index={true} />
					<Route element={<Entry />} path=':word' />
				</Routes>
			</Suspense>
		</ErrorBoundary>
	)
}
