import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import SideNav from '../../components/layout/SideNav'
import Icon from '../../components/ui/Icon'

export default function AccessDenied() {
  return (
    <PageLayout bare>
      <SideNav>
        <div className="min-h-screen flex items-center justify-center px-margin-mobile py-xl text-center">
          <div className="max-w-md">
            <div className="w-16 h-16 mx-auto mb-md rounded-full bg-error-container flex items-center justify-center">
              <Icon name="block" className="text-on-error-container text-3xl" />
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
              Access Denied
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              You don&apos;t have permission to view this page, or your account role couldn&apos;t be determined.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-full hover:shadow-lg transition-all"
            >
              <Icon name="home" />
              Back to Home
            </Link>
          </div>
        </div>
      </SideNav>
    </PageLayout>
  )
}
