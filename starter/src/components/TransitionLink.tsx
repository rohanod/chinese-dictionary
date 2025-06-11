import {Link, type LinkProps, useNavigate} from 'react-router'

export function TransitionLink(props: LinkProps) {
	const navigate = useNavigate()
	function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
		e.preventDefault()
		// biome-ignore lint/nursery/noSecrets: experimental API
		// biome-ignore lint/suspicious/noExplicitAny: cast for experimental API
		if ('startViewTransition' in document) {
			;(
				document as unknown as {
					startViewTransition(cb: () => void): void
				}
			).startViewTransition(() => navigate(props.to))
		} else {
			navigate(props.to)
		}
	}
	return <Link {...props} onClick={handleClick} />
}
