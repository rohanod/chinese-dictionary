import type HanziWriter from 'hanzi-writer'
import {useCallback, useEffect, useRef, useState} from 'react'
import {hanziWriterManager} from 'utils/hanziWriter'

export interface HanziDisplayProps {
	character: string
}

type DisplayMode = 'static' | 'stroke-order' | 'animation' | 'frames'

export function HanziDisplay({character}: HanziDisplayProps) {
	const [displayMode, setDisplayMode] = useState<DisplayMode>('static')
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentFrame, setCurrentFrame] = useState(0)
	const [frames, setFrames] = useState<string[]>([])
	const [writer, setWriter] = useState<HanziWriter | null>(null)

	const staticRef = useRef<HTMLDivElement>(null)
	const strokeOrderRef = useRef<HTMLDivElement>(null)
	const animationRef = useRef<HTMLDivElement>(null)
	const frameRef = useRef<HTMLDivElement>(null)

	// Initialize HanziWriter instances
	useEffect(() => {
		const initializeWriters = async () => {
			try {
				// For multi-character words, only show the first character in detail
				const displayChar = character.length > 1 ? character[0] : character

				if (!displayChar) {
					return
				}

				if (staticRef.current) {
					staticRef.current.innerHTML = ''
					await hanziWriterManager.createStaticCharacter(
						staticRef.current,
						displayChar,
						{
							width: 200,
							height: 200,
							padding: 20,
							showCharacter: true,
							showOutline: false
						}
					)
				}

				if (strokeOrderRef.current) {
					strokeOrderRef.current.innerHTML = ''
					await hanziWriterManager.createStrokeOrderCharacter(
						strokeOrderRef.current,
						displayChar,
						{
							width: 200,
							height: 200,
							padding: 20,
							showCharacter: true,
							showOutline: true
						}
					)

					// Add stroke order numbers
					await addStrokeOrderNumbers(strokeOrderRef.current, displayChar)
				}

				if (animationRef.current) {
					animationRef.current.innerHTML = ''
					const animationWriter =
						await hanziWriterManager.createAnimatedCharacter(
							animationRef.current,
							displayChar,
							{
								width: 200,
								height: 200,
								padding: 20,
								showCharacter: false,
								showOutline: true,
								strokeAnimationSpeed: 1,
								delayBetweenStrokes: 800
							}
						)
					setWriter(animationWriter)
				}

				// Generate frames for step-by-step display
				if (displayChar.length === 1) {
					try {
						const generatedFrames =
							await hanziWriterManager.generateStrokeFrames(displayChar)
						setFrames(generatedFrames)
					} catch (_error) {}
				}
			} catch (_error) {}
		}

		initializeWriters()

		return () => {
			hanziWriterManager.cleanup()
		}
	}, [character])

	const addStrokeOrderNumbers = async (
		container: HTMLElement,
		char: string
	) => {
		try {
			const charData = await hanziWriterManager.loadCharacterData(char)
			const svg = container.querySelector('svg')
			if (!(svg && charData.medians)) {
				return
			}

			charData.medians.forEach((median, index) => {
				if (median && median.length > 0) {
					const startPoint = median[0]
					if (startPoint && startPoint.length >= 2) {
						const text = document.createElementNS(
							'http://www.w3.org/2000/svg',
							'text'
						)
						text.setAttribute('x', (startPoint[0]! * 0.125 + 20).toString())
						text.setAttribute(
							'y',
							(112.5 - startPoint[1]! * 0.125 + 5).toString()
						)
						text.setAttribute('fill', '#FF6B6B')
						text.setAttribute('font-size', '12')
						text.setAttribute('font-weight', 'bold')
						text.textContent = (index + 1).toString()
						svg.appendChild(text)
					}
				}
			})
		} catch (_error) {}
	}

	const handlePlayAnimation = useCallback(async () => {
		if (!writer) {
			return
		}

		setIsPlaying(true)
		try {
			await hanziWriterManager.animateCharacter(writer)
		} catch (_error) {
		} finally {
			setIsPlaying(false)
		}
	}, [writer])

	const handleStopAnimation = useCallback(() => {
		if (!writer) {
			return
		}
		hanziWriterManager.stopAnimation(writer)
		setIsPlaying(false)
	}, [writer])

	const handleFrameChange = useCallback(
		(frameIndex: number) => {
			setCurrentFrame(frameIndex)
			if (frameRef.current && frames[frameIndex]) {
				frameRef.current.innerHTML = frames[frameIndex]
			}
		},
		[frames]
	)

	const renderDisplayModeContent = () => {
		switch (displayMode) {
			case 'static':
				return (
					<div className='text-center'>
						<div className='inline-block' ref={staticRef} />
						<p className='mt-4 text-gray-600 text-sm dark:text-gray-400'>
							Static character display
						</p>
					</div>
				)

			case 'stroke-order':
				return (
					<div className='text-center'>
						<div className='inline-block' ref={strokeOrderRef} />
						<p className='mt-4 text-gray-600 text-sm dark:text-gray-400'>
							Stroke order with numbers
						</p>
					</div>
				)

			case 'animation':
				return (
					<div className='text-center'>
						<div className='mb-4 inline-block' ref={animationRef} />
						<div className='flex justify-center space-x-4'>
							<button
								className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
								disabled={isPlaying}
								onClick={handlePlayAnimation}
							>
								{isPlaying ? 'Playing...' : 'Play Animation'}
							</button>
							{isPlaying && (
								<button
									className='rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700'
									onClick={handleStopAnimation}
								>
									Stop
								</button>
							)}
						</div>
						<p className='mt-4 text-gray-600 text-sm dark:text-gray-400'>
							Animated stroke order sequence
						</p>
					</div>
				)

			case 'frames':
				return (
					<div className='text-center'>
						<div className='mb-4 inline-block' ref={frameRef} />
						{frames.length > 0 && (
							<div className='space-y-4'>
								<div className='flex justify-center'>
									<input
										className='w-64'
										max={frames.length - 1}
										min='0'
										onChange={e =>
											handleFrameChange(Number.parseInt(e.target.value, 10))
										}
										type='range'
										value={currentFrame}
									/>
								</div>
								<div className='text-gray-600 text-sm dark:text-gray-400'>
									Frame {currentFrame + 1} of {frames.length}
								</div>
								<div className='flex justify-center space-x-2'>
									<button
										className='rounded bg-gray-600 px-3 py-1 text-white transition-colors hover:bg-gray-700 disabled:bg-gray-400'
										disabled={currentFrame === 0}
										onClick={() =>
											handleFrameChange(Math.max(0, currentFrame - 1))
										}
									>
										Previous
									</button>
									<button
										className='rounded bg-gray-600 px-3 py-1 text-white transition-colors hover:bg-gray-700 disabled:bg-gray-400'
										disabled={currentFrame === frames.length - 1}
										onClick={() =>
											handleFrameChange(
												Math.min(frames.length - 1, currentFrame + 1)
											)
										}
									>
										Next
									</button>
								</div>
							</div>
						)}
						<p className='mt-4 text-gray-600 text-sm dark:text-gray-400'>
							Step-by-step stroke progression
						</p>
					</div>
				)

			default:
				return null
		}
	}

	// Show message for multi-character words
	if (character.length > 1) {
		return (
			<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
				<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
					Character Display: {character}
				</h3>
				<div className='mb-6 text-center'>
					<div className='mb-4 font-bold text-6xl text-gray-800 dark:text-white'>
						{character}
					</div>
					<p className='text-gray-600 dark:text-gray-400'>
						Showing first character ({character[0]}) in detail below
					</p>
				</div>

				{/* Display Mode Selector */}
				<div className='mb-6'>
					<div className='flex flex-wrap justify-center gap-2'>
						{(
							['static', 'stroke-order', 'animation', 'frames'] as DisplayMode[]
						).map(mode => (
							<button
								className={`rounded-lg px-4 py-2 font-medium transition-colors ${
									displayMode === mode
										? 'bg-blue-600 text-white'
										: 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-700 dark:text-gray-200'
								}`}
								key={mode}
								onClick={() => setDisplayMode(mode)}
							>
								{mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
							</button>
						))}
					</div>
				</div>

				{renderDisplayModeContent()}
			</div>
		)
	}

	return (
		<div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
			<h3 className='mb-4 font-semibold text-gray-800 text-lg dark:text-white'>
				Character Display
			</h3>

			{/* Display Mode Selector */}
			<div className='mb-6'>
				<div className='flex flex-wrap justify-center gap-2'>
					{(
						['static', 'stroke-order', 'animation', 'frames'] as DisplayMode[]
					).map(mode => (
						<button
							className={`rounded-lg px-4 py-2 font-medium transition-colors ${
								displayMode === mode
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 dark:bg-gray-700 dark:text-gray-200'
							}`}
							key={mode}
							onClick={() => setDisplayMode(mode)}
						>
							{mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
						</button>
					))}
				</div>
			</div>

			{renderDisplayModeContent()}
		</div>
	)
}
