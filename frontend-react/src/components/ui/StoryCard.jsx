import Icon from './Icon'

export default function StoryCard({ story, featured = false }) {
  if (featured) {
    return (
      <article className="md:col-span-8 bg-white rounded-3xl overflow-hidden border border-outline-variant/10 flex flex-col md:flex-row">
        <div className="md:w-1/2 min-h-64 bg-primary-container flex items-center justify-center relative">
          <Icon name="auto_stories" className="text-primary text-[96px] opacity-40" />
          <div className="absolute top-4 left-4">
            <span className="bg-primary px-3 py-1 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              Featured
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-4">
          {story.region && (
            <div className="flex items-center gap-2">
              <Icon name="location_on" filled className="text-primary" />
              <span className="text-label-md font-label-md text-on-surface-variant">{story.region} Region</span>
            </div>
          )}
          <h3 className="font-headline-md text-headline-md text-on-surface">{story.title}</h3>
          <p className="text-body-md text-on-surface-variant italic line-clamp-4">{story.narrative}</p>
          {story.career_path?.title && (
            <p className="text-label-md text-primary font-bold">Career path: {story.career_path.title}</p>
          )}
        </div>
      </article>
    )
  }

  return (
    <article className="md:col-span-4 bg-white p-6 rounded-3xl border border-outline-variant/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary-fixed">
          <Icon name="person" className="text-primary text-[28px]" />
        </div>
        {story.region && (
          <span className="bg-surface-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
            {story.region}
          </span>
        )}
      </div>
      <div>
        <h4 className="font-headline-md text-headline-md text-on-surface">{story.title}</h4>
        {story.career_path?.title && <p className="text-label-md text-primary mt-1">{story.career_path.title}</p>}
      </div>
      <p className="text-body-md text-on-surface-variant line-clamp-3">{story.narrative}</p>
    </article>
  )
}
