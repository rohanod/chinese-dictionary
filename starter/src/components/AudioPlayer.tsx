import {useCallback, useState} from 'react'

export interface AudioPlayerProps {
	character: string
	pinyin?: string | undefined
}

export function AudioPlayer({character, pinyin}: AudioPlayerProps) {
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
				const chineseVoice = voices.find(
					voice =>
						voice.lang.startsWith('zh') ||
						voice.lang.includes('Chinese') ||
						voice.name.includes('Chinese')
				)

				if (chineseVoice) {
					utterance.voice = chineseVoice
				}

				utterance.onend = () => setIsPlaying(false)
				utterance.onerror = _event => {
					setIsPlaying(false)
					setAudioError('Speech synthesis failed')
				}

				window.speechSynthesis.speak(utterance)
			} else {
				throw new Error('Speech synthesis not supported')
			}
		} catch (_error) {
			setIsPlaying(false)
			setAudioError('Audio playback not available')
		}
	}, [])

	const stopAudio = useCallback(() => {
		if ('speechSynthesis' in window) {
			window.speechSynthesis.cancel()
		}
		setIsPlaying(false)
	}, [])

	return (
		<div className='space-y-4'>
			{/* Character Pronunciation */}
			<div className='flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
				<div>
					<div className='font-bold text-2xl text-gray-800 dark:text-white'>
						{character}
					</div>
					{pinyin && (
						<div className='text-blue-600 text-lg dark:text-blue-400'>
							{pinyin}
						</div>
					)}
				</div>
				<div className='flex space-x-2'>
					<button
						className='rounded-full bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
						disabled={isPlaying}
						onClick={() => playAudio(character)}
						title='Play character pronunciation'
					>
						{isPlaying ? (
							<svg
								className='h-5 w-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									d='M10 9v6m4-6v6'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						) : (
							<svg
								className='h-5 w-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 6l4 6-4 6V6z'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						)}
					</button>

					{isPlaying && (
						<button
							className='rounded-full bg-red-600 p-3 text-white transition-colors hover:bg-red-700'
							onClick={stopAudio}
							title='Stop audio'
						>
							<svg
								className='h-5 w-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									d='M6 6h12v12H6z'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Individual Character Pronunciation for Multi-character Words */}
			{character.length > 1 && (
				<div>
					<h4 className='mb-3 font-medium text-gray-800 dark:text-white'>
						Individual Characters:
					</h4>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
						{Array.from(character).map((char, index) => (
							<div
								className='flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700'
								key={`${char}-${index}`}
							>
								<span className='font-bold text-gray-800 text-xl dark:text-white'>
									{char}
								</span>
								<button
									className='rounded-full bg-gray-600 p-2 text-white transition-colors hover:bg-gray-700 disabled:bg-gray-400'
									disabled={isPlaying}
									onClick={() => playAudio(char)}
									title={`Play ${char} pronunciation`}
								>
									<svg
										className='h-4 w-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 6l4 6-4 6V6z'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Audio Error Message */}
			{audioError && (
				<div className='rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-700 dark:bg-red-900'>
					<p className='text-red-700 text-sm dark:text-red-300'>{audioError}</p>
				</div>
			)}

			{/* Audio Info */}
			<div className='text-gray-500 text-xs dark:text-gray-400'>
				<p>
					🔊 Audio pronunciation uses your browser's text-to-speech engine. For
					best results, ensure you have Chinese language support installed.
				</p>
			</div>
		</div>
	)
}
