export default function SubmitButton({ submitting, children = 'Save & Continue' }) {
  return (
    <div className="pt-sm">
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-md rounded-lg font-semibold active:scale-[0.98] transition-all hover:bg-secondary-fixed shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {submitting ? (
          <>
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Saving...
          </>
        ) : (
          children
        )}
      </button>
    </div>
  )
}
