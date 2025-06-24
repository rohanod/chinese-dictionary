import { LoadingOrError } from 'components/LoadingOrError'
import { Navbar } from 'components/Navbar'
import { Footer } from 'components/Footer'
import { Home } from 'pages/Home'
import { Search } from 'pages/Search'
import { Translate } from 'pages/Translate'
import { CharacterPage } from 'pages/CharacterPage'
import { MyLists } from 'pages/MyLists'
import { Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Route, Routes } from 'react-router'

function renderError({ error }: FallbackProps) {
	return <LoadingOrError error={error} />
}

export function App() {
	return (
		<ErrorBoundary fallbackRender={renderError}>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow">
					<Suspense fallback={<LoadingOrError />}>
						<Routes>
							<Route element={<Home />} index={true} />
							<Route element={<Search />} path="/search" />
							<Route element={<Translate />} path="/translate" />
							<Route element={<CharacterPage />} path="/character/:term" />
							<Route element={<MyLists />} path="/lists" />
						</Routes>
					</Suspense>
				</main>
				<Footer />
			</div>
		</ErrorBoundary>
	)
}
