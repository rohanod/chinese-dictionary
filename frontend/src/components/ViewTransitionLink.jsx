import { Link, useNavigate } from 'react-router-dom';

export default function ViewTransitionLink({ to, children, ...rest }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    const go = () => navigate(to);
    if (document.startViewTransition) {
      document.startViewTransition(go);
    } else {
      go();
    }
  };
  return <a href={to} onClick={handleClick} {...rest}>{children}</a>;
}
