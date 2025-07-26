declare module 'chinese-lexicon' {
	export interface DictionaryEntry {
		simp: string
		trad: string
		definitions: string[]
		pinyin: string
		searchablePinyin: string
		simpEtymology?: {
			notes: string
			definition: string
			components: Array<{
				type: string
				char: string
				fragment?: number[]
			}>
		}
		tradEtymology?: {
			notes: string
			definition: string
			components: Array<{
				type: string
				char: string
				fragment?: number[]
			}>
		}
		statistics?: {
			hskLevel: number
			movieWordCount: number
			movieWordCountPercent: number
			movieWordRank: number
			movieWordContexts: number
			movieWordContextsPercent: number
			bookWordCount: number
			bookWordCountPercent: number
			bookWordRank: number
			movieCharCount: number
			movieCharCountPercent: number
			movieCharRank: number
			movieCharContexts: number
			movieCharContextsPercent: number
			bookCharCount: number
			bookCharCountPercent: number
			bookCharRank: number
			pinyinFrequency: number
		}
	}

	export function getEntries(word: string): DictionaryEntry[]
	export function search(term: string, limit?: number): DictionaryEntry[]
	export function getGloss(word: string, pinyin?: string): string
	export const allEntries: DictionaryEntry[]
}

declare module 'hanzi-writer' {
	export interface CharacterJson {
		strokes: string[]
		medians: number[][][]
		radStrokes?: number[]
	}

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
		showHintAfterMisses?: number | boolean
		markStrokeCorrectAfterMisses?: number
		quizStartStrokeNum?: number
		acceptBackwardsStrokes?: boolean
		highlightOnComplete?: boolean
		highlightCompleteColor?: string
		charDataLoader?: (
			char: string,
			onComplete: (data: CharacterJson) => void
		) => void
		onLoadCharDataSuccess?: (data: CharacterJson) => void
		onLoadCharDataError?: (reason: any) => void
		renderer?: string
	}

	export interface AnimationOptions {
		onComplete?: () => void
	}

	export interface QuizOptions {
		onComplete?: (data: {totalMistakes: number}) => void
		onCorrectStroke?: (data: any) => void
		onMistake?: (data: any) => void
		showHintAfterMisses?: number | boolean
		markStrokeCorrectAfterMisses?: number
		quizStartStrokeNum?: number
		acceptBackwardsStrokes?: boolean
		leniency?: number
		highlightOnComplete?: boolean
	}

	export default class HanziWriter {
		static create(
			target: string | HTMLElement,
			character: string,
			options?: HanziWriterOptions
		): HanziWriter
		static loadCharacterData(
			character: string,
			options?: Partial<HanziWriterOptions>
		): Promise<CharacterJson>
		static getScalingTransform(
			width: number,
			height: number,
			padding?: number
		): {
			x: number
			y: number
			scale: number
			transform: string
		}

		animateCharacter(options?: AnimationOptions): Promise<void>
		animateStroke(strokeNum: number, options?: AnimationOptions): Promise<void>
		highlightStroke(
			strokeNum: number,
			options?: AnimationOptions
		): Promise<void>
		loopCharacterAnimation(): void
		pauseAnimation(): void
		resumeAnimation(): void
		setCharacter(character: string): void
		quiz(options?: QuizOptions): void
		cancelQuiz(): void
		showCharacter(options?: {onComplete?: () => void; duration?: number}): void
		hideCharacter(options?: {onComplete?: () => void; duration?: number}): void
		showOutline(options?: {onComplete?: () => void; duration?: number}): void
		hideOutline(options?: {onComplete?: () => void; duration?: number}): void
		updateDimensions(options?: {
			width?: number
			height?: number
			padding?: number
		}): void
		updateColor(
			colorName: string,
			colorVal: string,
			options?: {onComplete?: () => void; duration?: number}
		): void
	}
}
