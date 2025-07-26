import {useState, useCallback} from 'react'

export interface AudioPlayerProps {
	character: string
	pinyin?: string | undefined
}

export function AudioPlayer({ character, pinyin }: AudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [audioError, setAudioError] = useState<string | null>(null)

	const playAudio = useCallback(async (text: string) => {
		setIsPlaying(true)
		setAudioError(null)

		try {
			// Check if Speech Synthesis is supported
			if ('speechSynthesis' in window) {
				// Cancel any ongoing speech
				window.speechSynthesis.cancel()

				const utterance = new SpeechSynthesisUtterance(text)
				utterance.lang = 'zh-CN'
				utterance.rate = 0.8
				utterance.pitch = 1

				// Try to find a Chinese voice
				const voices = window.speechSynthesis.getVoices()
				const chineseVoice = voices.find(voice => 
					voice.lang.startsWith('zh') || 
					voice.lang.includes('Chinese') ||
					voice.name.includes('Chinese')
				)
				
				if (chineseVoice) {
					utterance.voice = chineseVoice
				}

				utterance.onend = () => setIsPlaying(false)
				utterance.onerror = (event) => {
					setIsPlaying(false)
					setAudioError('Speech synthesis failed')
					console.error('Speech synthesis error:', event)
				}

				window.speechSynthesis.speak(utterance)
			} else {
				throw new Error('Speech synthesis not supported')
			}
		} catch (error) {
			setIsPlaying(false)
			setAudioError('Audio playback not available')
			console.error('Audio playback error:', error)
		}
	}, [])

	const stopAudio = useCallback(() => {
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel()
		}
		setIsPlaying(false)
	}, [])

	return (
		<div className="space-y-4">
			{/* Character Pronunciation */}
			<div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<div>
					<div className="text-2xl font-bold text-gray-800 dark:text-white">
						{character}
					</div>
					{pinyin && (
						<div className="text-lg text-blue-600 dark:text-blue-400">
							{pinyin}
						</div>
					)}
				</div>
				<div className="flex space-x-2">
					<button
						onClick={() => playAudio(character)}
						disabled={isPlaying}
						className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-full transition-colors"
						title="Play character pronunciation"
					>
						{isPlaying ? (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
							</svg>
						) : (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 6l4 6-4 6V6z" />
							</svg>
						)}
					</button>
					
					{isPlaying && (
						<button
							onClick={stopAudio}
							className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
							title="Stop audio"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12v12H6z" />
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Individual Character Pronunciation for Multi-character Words */}
			{character.length > 1 && (
				<div>
					<h4 className="font-medium text-gray-800 dark:text-white mb-3">
						Individual Characters:
					</h4>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
						{Array.from(character).map((char, index) => (
							<div key={`${char}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
								<span className="text-xl font-bold text-gray-800 dark:text-white">
									{char}
								</span>
								<button
									onClick={() => playAudio(char)}
									disabled={isPlaying}
									className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white p-2 rounded-full transition-colors"
									title={`Play ${char} pronunciation`}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 6l4 6-4 6V6z" />
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Audio Error Message */}
			{audioError && (
				<div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
					<p className="text-red-700 dark:text-red-300 text-sm">
						{audioError}
					</p>
				</div>
			)}

			{/* Audio Info */}
			<div className="text-xs text-gray-500 dark:text-gray-400">
				<p>
					🔊 Audio pronunciation uses your browser's text-to-speech engine. 
					For best results, ensure you have Chinese language support installed.
				</p>
			</div>
		</div>
	)
}