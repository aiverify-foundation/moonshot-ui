import { Icon, IconName } from '@/app/components/IconSVG';

function SelectedOptionPill({
  label,
  onXClick,
}: {
  label: string;
  onXClick: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-2 bg-moongray-900 border-moongray-900 rounded-[15px] px-[5px] py-[2px]">
      <div className="cursor-pointer hover:opacity-25">
        <Icon
          name={IconName.Close}
          onClick={onXClick}
        />
      </div>
      <p className="text-[0.9rem] text-moongray-200 whitespace-nowrap overflow-hidden text-ellipsis w-[150px] px-1">
        {label}
      </p>
    </div>
  );
}

export { SelectedOptionPill };
