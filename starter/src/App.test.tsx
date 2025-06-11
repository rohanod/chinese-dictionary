import {App} from './App'
import {render, screen} from './test-utils'

it('renders search page', () => {
	render(<App />)
	expect(screen.getByText('Chinese Dictionary')).toBeInTheDocument()
})
