type PlaceholderCardProps = {
  title: string;
  descriptionLines?: number;
  compact?: boolean;
};

export function PlaceholderCard({
  title,
  descriptionLines = 3,
  compact = false,
}: PlaceholderCardProps) {
  return (
    <article className="overflow-hidden bg-transparent">
      <div className="relative aspect-[2/1] w-full bg-[#c9c3c3]" />

      <div className="bg-[#e0e0e0] px-4 py-4">
        <h3 className="mb-3 line-clamp-2 text-[16px] font-semibold leading-snug text-[#1d1d1d]">
          {title}
        </h3>

        {!compact ? (
          <div className="mb-4 space-y-2">
            {Array.from({ length: descriptionLines }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-full bg-black/10"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : null}

        <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1f1f1f]">
          Lexo më shumë <span className="text-[11px]">▸</span>
        </div>
      </div>
    </article>
  );
}

