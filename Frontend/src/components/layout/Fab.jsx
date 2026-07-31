import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

export default function Fab({ to = '/ai-chat', icon = 'chat_bubble' }) {
  return (
    <Link
      to={to}
      className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
    >
      <Icon name={icon} className="text-3xl group-hover:rotate-12 transition-transform" />
    </Link>
  )
}
