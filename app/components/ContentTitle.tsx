interface ContentTitleProrps {
  title: string;
  subtitle: string;
}
export default function ContentTitle({ title, subtitle }: ContentTitleProrps) {
  return (
    <div>
      <h2 className="text-xs opacity-70">{subtitle}</h2>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}
