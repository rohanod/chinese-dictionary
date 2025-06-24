export function Navbar() {
	return (
		<nav className="bg-gray-800 p-4 text-white">
			<div className="container mx-auto flex justify-between">
				<a href="/" className="text-xl font-bold">Chinese Dictionary</a>
				<div>
					<a href="/search" className="px-3 hover:text-gray-300">Search</a>
					<a href="/translate" className="px-3 hover:text-gray-300">Translate</a>
					<a href="/lists" className="px-3 hover:text-gray-300">My Lists</a>
				</div>
			</div>
		</nav>
	)
}
