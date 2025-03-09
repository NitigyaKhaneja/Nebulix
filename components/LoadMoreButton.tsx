export function LoadMoreButton({ onLoadMore, hasMore }: { onLoadMore: () => void; hasMore: boolean }) {
    return (
      hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
          >
            Load More Movies
          </button>
        </div>
      )
    );
  }
  