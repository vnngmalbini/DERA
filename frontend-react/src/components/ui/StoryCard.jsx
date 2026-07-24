import Icon from './Icon'

export default function StoryCard({ story, featured = false }) {
  if (featured) {
    return (
      <article className="md:col-span-8 bg-white rounded-3xl overflow-hidden border border-outline-variant/10 flex flex-col md:flex-row">
        <div className="md:w-1/2 h-64 md:h-full relative">
          <img className="w-full h-full object-cover" alt={story.alt} src={story.image} />
          <div className="absolute top-4 left-4">
            <span className="bg-primary px-3 py-1 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              Featured
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="location_on" filled className="text-primary" />
            <span className="text-label-md font-label-md text-on-surface-variant">{story.region} Region</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">{story.name}</h3>
          <p className="text-body-md text-on-surface-variant italic">{story.quote}</p>
          <div className="pt-4">
            <button className="flex items-center gap-2 text-primary font-bold group">
              Read Full Story
              <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="md:col-span-4 bg-white p-6 rounded-3xl border border-outline-variant/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-fixed">
          <img className="w-full h-full object-cover" alt={story.alt} src={story.image} />
        </div>
        <span className="bg-surface-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
          {story.region}
        </span>
      </div>
      <div>
        <h4 className="font-headline-md text-headline-md text-on-surface">{story.name}</h4>
        <p className="text-label-md text-primary mt-1">{story.role}</p>
      </div>
      <p className="text-body-md text-on-surface-variant line-clamp-3">{story.bio}</p>
      <button className="w-full py-3 border border-primary text-primary rounded-xl font-label-md hover:bg-primary hover:text-white transition-all">
        Read Story
      </button>
    </article>
  )
}
