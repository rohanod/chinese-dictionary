import {useState} from 'react'

export interface ExampleSentencesProps {
	character: string
}

interface ExampleSentence {
	chinese: string
	pinyin: string
	english: string
	source?: string
}

export function ExampleSentences({character}: ExampleSentencesProps) {
	// In a real implementation, these would come from an API or database
	// For now, we'll use some sample sentences
	const [sentences] = useState<ExampleSentence[]>(() => {
		// Generate some example sentences based on the character
		const exampleSentences: Record<string, ExampleSentence[]> = {
			你: [
				{
					chinese: '你好吗？',
					pinyin: 'Nǐ hǎo ma?',
					english: 'How are you?'
				},
				{
					chinese: '你是谁？',
					pinyin: 'Nǐ shì shéi?',
					english: 'Who are you?'
				},
				{
					chinese: '你住在哪里？',
					pinyin: 'Nǐ zhù zài nǎlǐ?',
					english: 'Where do you live?'
				}
			],
			我: [
				{
					chinese: '我很好。',
					pinyin: 'Wǒ hěn hǎo.',
					english: 'I am very well.'
				},
				{
					chinese: '我是学生。',
					pinyin: 'Wǒ shì xuéshēng.',
					english: 'I am a student.'
				},
				{
					chinese: '我爱你。',
					pinyin: 'Wǒ ài nǐ.',
					english: 'I love you.'
				}
			],
			好: [
				{
					chinese: '今天天气很好。',
					pinyin: 'Jīntiān tiānqì hěn hǎo.',
					english: 'The weather is very good today.'
				},
				{
					chinese: '这个想法很好。',
					pinyin: 'Zhège xiǎngfǎ hěn hǎo.',
					english: 'This idea is very good.'
				}
			],
			你好: [
				{
					chinese: '你好，很高兴见到你。',
					pinyin: 'Nǐhǎo, hěn gāoxìng jiàndào nǐ.',
					english: 'Hello, nice to meet you.'
				},
				{
					chinese: '你好，请问你叫什么名字？',
					pinyin: 'Nǐhǎo, qǐngwèn nǐ jiào shénme míngzì?',
					english: 'Hello, what is your name?'
				}
			],
			爱: [
				{
					chinese: '我爱我的家人。',
					pinyin: 'Wǒ ài wǒ de jiārén.',
					english: 'I love my family.'
				},
				{
					chinese: '她爱看书。',
					pinyin: 'Tā ài kànshū.',
					english: 'She loves reading books.'
				}
			],
			家: [
				{
					chinese: '我想回家。',
					pinyin: 'Wǒ xiǎng huíjiā.',
					english: 'I want to go home.'
				},
				{
					chinese: '这是我的家。',
					pinyin: 'Zhè shì wǒ de jiā.',
					english: 'This is my home.'
				}
			]
		}

		// Return sentences for the specific character or generate generic ones
		if (exampleSentences[character]) {
			return exampleSentences[character]
		}

		// Generate some generic sentences containing the character
		return [
			{
				chinese: `这个字是"${character}"。`,
				pinyin: `Zhège zì shì "${character}".`,
				english: `This character is "${character}".`
			},
			{
				chinese: `我正在学习"${character}"字。`,
				pinyin: `Wǒ zhèngzài xuéxí "${character}" zì.`,
				english: `I am learning the character "${character}".`
			},
			{
				chinese: `"${character}"是一个很有用的字。`,
				pinyin: `"${character}" shì yīgè hěn yǒuyòng de zì.`,
				english: `"${character}" is a very useful character.`
			}
		]
	})

	const [playingIndex, setPlayingIndex] = useState<number | null>(null)

	const playAudio = (text: string, index: number) => {
		if ('speechSynthesis' in window) {
			// Stop any ongoing speech
			window.speechSynthesis.cancel()

			setPlayingIndex(index)

			const utterance = new SpeechSynthesisUtterance(text)
			utterance.lang = 'zh-CN'
			utterance.rate = 0.7
			utterance.pitch = 1

			// Try to find a Chinese voice
			const voices = window.speechSynthesis.getVoices()
			const chineseVoice = voices.find(
				voice => voice.lang.startsWith('zh') || voice.lang.includes('Chinese')
			)

			if (chineseVoice) {
				utterance.voice = chineseVoice
			}

			utterance.onend = () => setPlayingIndex(null)
			utterance.onerror = () => setPlayingIndex(null)

			window.speechSynthesis.speak(utterance)
		}
	}

	const highlightCharacter = (text: string, targetChar: string) => {
		// Highlight the target character in the sentence
		return text.split('').map((char, index) => (
			<span
				className={
					char === targetChar
						? 'rounded bg-yellow-200 px-1 dark:bg-yellow-700'
						: ''
				}
				key={index}
			>
				{char}
			</span>
		))
	}

	if (sentences.length === 0) {
		return (
			<div className='py-8 text-center'>
				<div className='mb-4 text-4xl text-gray-400 dark:text-gray-500'>📚</div>
				<p className='text-gray-600 dark:text-gray-400'>
					No example sentences available for this character yet.
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			{sentences.map((sentence, index) => (
				<div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700' key={index}>
					<div className='mb-3 flex items-start justify-between'>
						<div className='flex-1'>
							<div className='mb-1 font-medium text-gray-800 text-lg dark:text-white'>
								{highlightCharacter(sentence.chinese, character)}
							</div>
							<div className='mb-2 text-blue-600 dark:text-blue-400'>
								{sentence.pinyin}
							</div>
							<div className='text-gray-600 dark:text-gray-300'>
								{sentence.english}
							</div>
							{sentence.source && (
								<div className='mt-2 text-gray-500 text-xs dark:text-gray-400'>
									Source: {sentence.source}
								</div>
							)}
						</div>

						<button
							className='ml-4 shrink-0 rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400'
							disabled={playingIndex !== null}
							onClick={() => playAudio(sentence.chinese, index)}
							title='Play pronunciation'
						>
							{playingIndex === index ? (
								<svg
									className='h-4 w-4 animate-pulse'
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
							)}
						</button>
					</div>
				</div>
			))}

			<div className='text-center text-gray-500 text-xs dark:text-gray-400'>
				💡 Tip: The highlighted character shows where "{character}" appears in
				each sentence.
			</div>
		</div>
	)
}
