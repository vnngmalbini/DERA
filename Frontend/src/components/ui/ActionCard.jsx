import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function ActionCard({ icon, title, description, to }) {
  const Wrapper = to ? Link : 'div'
  return (
    <Wrapper
      to={to}
      className="group bg-surface-container-highest p-6 rounded-2xl cursor-pointer hover:bg-primary-container transition-all duration-300 transform hover:-translate-y-1 block"
    >
      <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-primary mb-4 group-hover:bg-on-primary-container transition-colors">
        <Icon name={icon} className="text-3xl" />
      </div>
      <h4 className="font-headline-md text-headline-md-mobile md:text-headline-md text-on-surface mb-2 group-hover:text-on-primary-container">
        {title}
      </h4>
      <p className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-primary-container/80">
        {description}
      </p>
    </Wrapper>
  )
}
