import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ListItem {
	id: string; // hanzi character or phrase
	// We can add more details here if needed, e.g., pinyin, short def, addedDate
}

interface CharacterList {
	name: string;
	items: ListItem[];
}

const DEFAULT_LISTS: CharacterList[] = [
	{ name: "Learned", items: [] },
	{ name: "Learning", items: [] },
];

const LOCAL_STORAGE_KEY = 'chineseDictionaryLists';

export function MyLists() {
	const [lists, setLists] = useState<CharacterList[]>(() => {
		const storedLists = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedLists) {
			try {
				const parsedLists = JSON.parse(storedLists) as CharacterList[];
        // Ensure default lists exist if storage is empty or corrupted for them
        let updated = false;
        DEFAULT_LISTS.forEach(defaultList => {
          if (!parsedLists.find(l => l.name === defaultList.name)) {
            parsedLists.push({...defaultList});
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedLists));
        }
				return parsedLists;
			} catch (e) {
				console.error("Failed to parse lists from localStorage", e);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_LISTS));
				return DEFAULT_LISTS;
			}
		}
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_LISTS));
		return DEFAULT_LISTS;
	});

	const [newListName, setNewListName] = useState('');

	useEffect(() => {
		// This effect is primarily for when lists are modified by other components (e.g., adding from CharacterPage)
		// For now, direct modifications on this page will also trigger re-save via setLists.
		const handleStorageChange = () => {
			const storedLists = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (storedLists) {
				try {
					setLists(JSON.parse(storedLists));
				} catch (e) {
					console.error("Failed to parse lists from storage event", e);
				}
			}
		};
		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	const saveLists = (updatedLists: CharacterList[]) => {
		setLists(updatedLists);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLists));
	};

	const handleCreateList = () => {
		if (newListName.trim() && !lists.find(list => list.name === newListName.trim())) {
			const updatedLists = [...lists, { name: newListName.trim(), items: [] }];
			saveLists(updatedLists);
			setNewListName('');
		} else if (lists.find(list => list.name === newListName.trim())) {
			alert("A list with this name already exists.");
		}
	};

	const handleDeleteList = (listNameToDelete: string) => {
		if (DEFAULT_LISTS.find(l => l.name === listNameToDelete)) {
			alert(`Cannot delete default list: ${listNameToDelete}. You can clear its items.`);
			return;
		}
		if (window.confirm(`Are you sure you want to delete the list "${listNameToDelete}"?`)) {
			const updatedLists = lists.filter(list => list.name !== listNameToDelete);
			saveLists(updatedLists);
		}
	};

	const handleRemoveItem = (listName: string, itemId: string) => {
		const updatedLists = lists.map(list => {
			if (list.name === listName) {
				return { ...list, items: list.items.filter(item => item.id !== itemId) };
			}
			return list;
		});
		saveLists(updatedLists);
	};

	// Note: Adding items to lists will be primarily handled from the CharacterPage.
	// For testing, you might want a temporary add function here or manually edit localStorage.

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">My Lists</h1>

			<div className="mb-6 p-4 border rounded shadow-sm">
				<h2 className="text-xl font-semibold mb-2">Create New List</h2>
				<div className="flex">
					<input
						type="text"
						value={newListName}
						onChange={(e) => setNewListName(e.target.value)}
						placeholder="New list name"
						className="border p-2 flex-grow mr-2"
					/>
					<button onClick={handleCreateList} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
						Create List
					</button>
				</div>
			</div>

			{lists.length === 0 && <p>No lists created yet. Use the form above to create one!</p>}

			<div className="space-y-6">
				{lists.map(list => (
					<div key={list.name} className="p-4 border rounded shadow-sm">
						<div className="flex justify-between items-center mb-3">
							<h2 className="text-xl font-semibold">{list.name}</h2>
							{!DEFAULT_LISTS.find(l => l.name === list.name) && (
								<button
									onClick={() => handleDeleteList(list.name)}
									className="text-red-500 hover:text-red-700 text-sm"
								>
									Delete List
								</button>
							)}
						</div>
						{list.items.length === 0 ? (
							<p className="text-gray-500">This list is empty.</p>
						) : (
							<ul className="space-y-2">
								{list.items.map(item => (
									<li key={item.id} className="flex justify-between items-center p-2 border-b">
										<Link to={`/character/${item.id}`} className="text-blue-600 hover:underline">
											{item.id}
										</Link>
										<button
											onClick={() => handleRemoveItem(list.name, item.id)}
											className="text-red-500 hover:text-red-700 text-xs"
										>
											Remove
										</button>
									</li>
								))}
							</ul>
						)}
						{/* Placeholder for adding items directly, though primary add is from CharacterPage */}
						{/* <div className="mt-2">
							<input type="text" placeholder="Add Hanzi/Phrase to this list" className="border p-1 text-sm"/>
							<button className="bg-blue-400 text-white p-1 text-sm ml-1">Add</button>
						</div> */}
					</div>
				))}
			</div>
		</div>
	);
}
