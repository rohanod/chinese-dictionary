import './global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot, flushSync } from 'react-dom/client'
import { BrowserRouter, useLocation, useNavigationType } from 'react-router-dom'
import { App } from './App'
import { useEffect } from 'react'

const queryClient = new QueryClient()

async function enableMocking() {
	// if (process.env.NODE_ENV !== 'development') {
	//   return
	// }
	const { worker } = await import('./mocks/browser')
	return worker.start()
}

const container = document.querySelector('#root')

function Root() {
	const location = useLocation();
	const navType = useNavigationType();

	useEffect(() => {
		if (!document.startViewTransition) {
			return;
		}

		// Only run on SPA navigations, not initial load/full page reloads
		if (navType !== 'POP') { // POP is for back/forward, might want to handle differently or include
			document.startViewTransition(() => {
        // flushSync ensures DOM updates are applied synchronously before the transition starts
        // This is important for React to update the view before the snapshot is taken
				// No specific update needed here as react-router handles the rendering
				// The key is that React's render triggered by navigation happens within this callback
			});
		}
	}, [location, navType]);

	return <App />;
}


enableMocking()
	.then(() => {
		if (container) {
			const root = createRoot(container)
			root.render(
				<StrictMode>
					<QueryClientProvider client={queryClient}>
						<ReactQueryDevtools initialIsOpen={false} />
						<BrowserRouter>
							<Root />
						</BrowserRouter>
					</QueryClientProvider>
				</StrictMode>
			)
		}
	})
	.catch(error => {
		alert(`Failed to enable mocking: ${error}`)
	})
