export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-8 w-64 bg-surface-container-high rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 bg-surface-container-high rounded-xl" />
        ))}
      </div>
      <div className="h-40 bg-surface-container-high rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-56 bg-surface-container-high rounded-xl" />
        <div className="h-56 bg-surface-container-high rounded-xl" />
      </div>
    </div>
  )
}
