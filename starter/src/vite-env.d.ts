/// <reference types="vite/client" />

import type DetachedWindowApi from 'happy-dom/lib/window/DetachedWindowAPI.js'

// Extend the Document interface for View Transitions API
interface Document {
	startViewTransition?(callback: () => Promise<void> | void): ViewTransition;
}

interface ViewTransition {
	finished: Promise<void>;
	ready: Promise<void>;
	updateCallbackDone: Promise<void>;
	skipTransition: () => void;
}

declare global {
	interface Window {
		happyDOM?: DetachedWindowApi
	}
}
