interface ContentTitleProrps {
  title: string;
  subtitle: string;
}
export default function ContentTitle({ title, subtitle }: ContentTitleProrps) {
  return (
    <div>
      <h4 className="text-xs text-neutral-600">{subtitle}</h4>
      <h3 className="text-base font-semibold sm:text-xl">{title}</h3>
    </div>
  );
}
