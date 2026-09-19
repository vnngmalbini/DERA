import { useEffect, useState } from 'react'
import Icon from './Icon'
import SafeImage from './SafeImage'

const READ_MORE_THRESHOLD = 220

function StoryDetailModal({ story, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center px-margin-mobile animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-outline-variant/30 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-56 bg-primary-container flex items-center justify-center overflow-hidden">
            <SafeImage
              src={story.photo}
              alt={story.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              fallback={<Icon name="auto_stories" className="text-primary text-[96px] opacity-40" />}
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-on-surface hover:text-error transition-colors"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="p-lg space-y-3">
          {story.region && (
            <div className="flex items-center gap-2">
              <Icon name="location_on" filled className="text-primary" />
              <span className="text-label-md font-label-md text-on-surface-variant">{story.region} Region</span>
            </div>
          )}
          <div className="space-y-1">
            {story.speaker_name && (
              <p className="text-label-lg font-label-lg text-primary uppercase tracking-wide">{story.speaker_name}</p>
            )}
            <h3 className="font-headline-md text-headline-md text-on-surface">{story.title}</h3>
          </div>
          <p className="text-body-md text-on-surface-variant italic whitespace-pre-line">{story.narrative}</p>
          {story.career_path?.title && (
            <p className="text-label-md text-primary font-bold">Career path: {story.career_path.title}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StoryCard({ story, featured = false }) {
  const [showDetail, setShowDetail] = useState(false)
  const isLong = story.narrative.length > READ_MORE_THRESHOLD

  const readMoreButton = (
    <button
      onClick={() => setShowDetail(true)}
      className="read-more-link"
    >
      Read more <Icon name="arrow_forward" className="text-base" />
    </button>
  )

  if (featured) {
    return (
      <>
        <article className="md:col-span-8 bg-white rounded-3xl overflow-hidden border border-outline-variant/10 flex flex-col md:flex-row shadow-sm hover:shadow-xl transition-shadow duration-300 ease-emphasized">
          <div className="md:w-1/2 min-h-64 bg-primary-container flex items-center justify-center relative overflow-hidden">
            <SafeImage
              src={story.photo}
              alt={story.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              fallback={<Icon name="auto_stories" className="text-primary text-[96px] opacity-40" />}
            />
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
            <div className="space-y-1">
              {story.speaker_name && (
                <p className="text-label-lg font-label-lg text-primary uppercase tracking-wide">{story.speaker_name}</p>
              )}
              <h3 className="font-headline-md text-headline-md text-on-surface">{story.title}</h3>
            </div>
            <p className="text-body-md text-on-surface-variant italic line-clamp-4">{story.narrative}</p>
            {isLong && readMoreButton}
            {story.career_path?.title && (
              <p className="text-label-md text-primary font-bold">Career path: {story.career_path.title}</p>
            )}
          </div>
        </article>
        {showDetail && <StoryDetailModal story={story} onClose={() => setShowDetail(false)} />}
      </>
    )
  }

  return (
    <>
      <article className="md:col-span-4 bg-white p-6 rounded-2xl border border-outline-variant/10 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-emphasized">
        <div className="flex items-center justify-between">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary-fixed overflow-hidden">
            <SafeImage
              src={story.photo}
              alt={story.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              fallback={<Icon name="person" className="text-primary text-[28px]" />}
            />
          </div>
          {story.region && (
            <span className="bg-surface-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm">
              {story.region}
            </span>
          )}
        </div>
        <div>
          <div className="space-y-1">
            {story.speaker_name && (
              <p className="text-label-md font-label-md text-primary uppercase tracking-wide">{story.speaker_name}</p>
            )}
            <h4 className="font-headline-md text-headline-md text-on-surface">{story.title}</h4>
          </div>
          {story.career_path?.title && <p className="text-label-md text-on-surface-variant mt-1">{story.career_path.title}</p>}
        </div>
        <p className="text-body-md text-on-surface-variant line-clamp-3">{story.narrative}</p>
        {isLong && readMoreButton}
      </article>
      {showDetail && <StoryDetailModal story={story} onClose={() => setShowDetail(false)} />}
    </>
  )
}
