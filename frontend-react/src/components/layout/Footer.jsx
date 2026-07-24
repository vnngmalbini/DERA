import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const EXPLORE_LINKS = [
  { label: 'Scholarship Hub', to: '/scholarships' },
  { label: 'Career Discovery Quiz', to: '/career-quiz' },
  { label: 'Forms Marketplace', to: '/forms' },
  { label: 'Sponsorship', to: '/sponsorship' },
  { label: 'Real Stories', to: '/stories' },
  { label: 'Help Centre', to: '/help' },
]

const COMPANY_LINKS = [
  { label: 'About DERA', to: '/about' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'AI Assistant', to: '/ai-chat' },
]

export default function Footer() {
  return (
    <footer className="bg-on-background text-surface py-20 px-margin-mobile md:px-margin-desktop hidden md:block">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-1 mb-6">
            <Icon name="spa" className="text-primary-fixed text-headline-lg" filled />
            <h2 className="font-headline-lg text-headline-lg">DERA</h2>
          </div>
          <p className="font-body-md text-surface-variant max-w-sm mb-8">
            A grassroots initiative dedicated to empowering the next generation of Ghanaian leaders through
            technology, community, and accessible opportunity.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-outline/20 flex items-center justify-center hover:bg-primary transition-colors"
              href="#"
            >
              <Icon name="public" className="text-sm" />
            </a>
            <a
              className="w-10 h-10 rounded-full bg-outline/20 flex items-center justify-center hover:bg-primary transition-colors"
              href="#"
            >
              <Icon name="alternate_email" className="text-sm" />
            </a>
            <a
              className="w-10 h-10 rounded-full bg-outline/20 flex items-center justify-center hover:bg-primary transition-colors"
              href="#"
            >
              <Icon name="share" className="text-sm" />
            </a>
          </div>
        </div>
        <div>
          <h5 className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed mb-6">Explore</h5>
          <ul className="space-y-4">
            {EXPLORE_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="text-surface-variant hover:text-white transition-colors" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="font-label-md text-label-md uppercase tracking-widest text-primary-fixed mb-6">Company</h5>
          <ul className="space-y-4">
            {COMPANY_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="text-surface-variant hover:text-white transition-colors" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-surface-variant hover:text-white transition-colors" to="/login">
                Log In
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-outline/20 mt-20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-surface-variant text-label-sm font-label-sm">
        <p>© 2026 DERA. Growing Together.</p>
        <div className="flex gap-6">
          <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-white transition-colors" href="#">Safety Center</a>
        </div>
        <p>Made for Ghana, by the Community.</p>
      </div>
    </footer>
  )
}
