import {LoadingOrError} from 'components/LoadingOrError'
import {Home} from 'pages/Home'
import {lazy, Suspense} from 'react'
import {ErrorBoundary, type FallbackProps} from 'react-error-boundary'
import {Route, Routes} from 'react-router'

const Character = lazy(async () =>
	import('pages/Character').then(m => ({default: m.Character}))
)

const Search = lazy(async () =>
	import('pages/Search').then(m => ({default: m.Search}))
)

const Lists = lazy(async () =>
	import('pages/Lists').then(m => ({default: m.Lists}))
)

function renderError({error}: FallbackProps) {
	return <LoadingOrError error={error} />
}

export function App() {
	return (
		<ErrorBoundary fallbackRender={renderError}>
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route element={<Home />} index={true} />
					<Route element={<Search />} path="search" />
					<Route element={<Character />} path="character/:word" />
					<Route element={<Lists />} path="lists" />
				</Routes>
			</Suspense>
		</ErrorBoundary>
	)
}
