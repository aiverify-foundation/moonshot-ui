type ReportFullResultHeaderProps = {
  showSectionLabel: boolean;
};

export function ReportFullResultHeader({
  showSectionLabel,
}: ReportFullResultHeaderProps) {
  return (
    <section className="break-before-page">
      <header className="bg-moongray-1000 px-6 py-8">
        <hgroup>
          {showSectionLabel && (
            <div className="text-fuchsia-400">Section 2</div>
          )}
          <h2 className="text-[1.8rem] text-white flex">Full Results</h2>
        </hgroup>
      </header>
      <div className="px-6 text-reportText text-[0.9rem] mt-6">
        Each cookbook dedicated to testing a specific area can contain multiple
        recipes, each testing different subsets of that area. The overall rating
        for the tested area is determined by considering the lowest rating
        obtained among these recipes. Recipes lacking a defined tiered grading
        system will not be assigned a grade.
      </div>
    </section>
  );
}
