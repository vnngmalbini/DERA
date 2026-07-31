export default function DashboardPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-lg">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
          {title}
        </h1>
        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
