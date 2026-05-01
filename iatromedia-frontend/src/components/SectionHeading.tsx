type SectionHeadingProps = {
  title: string;
  className?: string;
};

export function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <div className={["py-6 text-center", className || ""].join(" ")}>
      <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1d] md:text-[34px]">
        {title}
      </h2>
    </div>
  );
}

