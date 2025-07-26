import HanziWriter from 'hanzi-writer'

export interface HanziWriterOptions {
	width?: number
	height?: number
	padding?: number
	showOutline?: boolean
	showCharacter?: boolean
	strokeColor?: string
	radicalColor?: string
	outlineColor?: string
	strokeAnimationSpeed?: number
	delayBetweenStrokes?: number
	delayBetweenLoops?: number
}

export interface CharacterStrokeData {
	strokes: string[]
	medians: number[][][]
	radStrokes?: number[]
}

export class HanziWriterManager {
	private writers: Map<string, HanziWriter> = new Map()

	async createWriter(
		target: string | HTMLElement,
		character: string,
		options: HanziWriterOptions = {}
	): Promise<HanziWriter> {
		const defaultOptions: HanziWriterOptions = {
			width: 200,
			height: 200,
			padding: 20,
			showOutline: true,
			showCharacter: true,
			strokeColor: '#555',
			radicalColor: '#168F16',
			outlineColor: '#DDD',
			strokeAnimationSpeed: 1,
			delayBetweenStrokes: 1000,
			delayBetweenLoops: 2000,
			...options
		}

		try {
			const writer = HanziWriter.create(target, character, defaultOptions)
			this.writers.set(`${target}-${character}`, writer)
			return writer
		} catch (error) {
			throw error
		}
	}

	async createStaticCharacter(
		target: string | HTMLElement,
		character: string,
		options: HanziWriterOptions = {}
	): Promise<HanziWriter> {
		return this.createWriter(target, character, {
			...options,
			showCharacter: true,
			showOutline: false
		})
	}

	async createStrokeOrderCharacter(
		target: string | HTMLElement,
		character: string,
		options: HanziWriterOptions = {}
	): Promise<HanziWriter> {
		const writer = await this.createWriter(target, character, {
			...options,
			showCharacter: false,
			showOutline: true
		})

		return writer
	}

	async createAnimatedCharacter(
		target: string | HTMLElement,
		character: string,
		options: HanziWriterOptions = {}
	): Promise<HanziWriter> {
		const writer = await this.createWriter(target, character, {
			...options,
			showCharacter: false,
			showOutline: true
		})

		return writer
	}

	async animateCharacter(writer: HanziWriter): Promise<void> {
		return new Promise(resolve => {
			writer.animateCharacter({
				onComplete: () => resolve()
			})
		})
	}

	async loopAnimation(writer: HanziWriter): Promise<void> {
		writer.loopCharacterAnimation()
	}

	stopAnimation(writer: HanziWriter): void {
		writer.pauseAnimation()
	}

	async loadCharacterData(character: string): Promise<CharacterStrokeData> {
		try {
			const data = await HanziWriter.loadCharacterData(character)
			return {
				strokes: data?.strokes || [],
				medians: data?.medians || [],
				radStrokes: data?.radStrokes || []
			}
		} catch (error) {
			throw error
		}
	}

	generateStrokeFrames(character: string): Promise<string[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await this.loadCharacterData(character)
				const frames: string[] = []

				// Create temporary container for generating frames
				const tempContainer = document.createElement('div')
				tempContainer.style.visibility = 'hidden'
				tempContainer.style.position = 'absolute'
				tempContainer.style.top = '-9999px'
				document.body.appendChild(tempContainer)

				for (let i = 0; i <= data.strokes.length; i++) {
					const frameContainer = document.createElement('div')
					frameContainer.id = `frame-${i}`
					tempContainer.appendChild(frameContainer)

					// Create writer for this frame
					const writer = HanziWriter.create(frameContainer, character, {
						width: 200,
						height: 200,
						padding: 20,
						showCharacter: false,
						showOutline: true
					})

					// Show strokes up to current index
					for (let j = 0; j < i; j++) {
						await new Promise<void>(resolve => {
							writer.animateStroke(j, {
								onComplete: () => resolve()
							})
						})
					}

					// Capture the SVG content
					const svg = frameContainer.querySelector('svg')
					if (svg) {
						frames.push(svg.outerHTML)
					}
				}

				// Clean up
				document.body.removeChild(tempContainer)
				resolve(frames)
			} catch (error) {
				reject(error)
			}
		})
	}

	getWriter(key: string): HanziWriter | undefined {
		return this.writers.get(key)
	}

	removeWriter(key: string): void {
		this.writers.delete(key)
	}

	cleanup(): void {
		this.writers.clear()
	}
}

export const hanziWriterManager = new HanziWriterManager()

export async function createCharacterSVG(
	character: string,
	options: {width?: number; height?: number; padding?: number} = {}
): Promise<string> {
	const {width = 200, height = 200, padding = 20} = options

	try {
		const data = await HanziWriter.loadCharacterData(character)
		const transform = HanziWriter.getScalingTransform(width, height, padding)

		let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`
		svg += `<g transform="${transform.transform}">`

		data?.strokes.forEach((strokePath: string) => {
			svg += `<path d="${strokePath}" fill="#555" />`
		})

		svg += '</g></svg>'
		return svg
	} catch (error) {
		throw error
	}
}
