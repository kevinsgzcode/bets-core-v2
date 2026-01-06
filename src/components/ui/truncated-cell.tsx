import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedCellProps {
  text: string;
  maxWidth?: string;
}

export const TruncatedCell = ({
  text,
  maxWidth = "max-w-[180px]",
}: TruncatedCellProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={`block truncate cursor-help ${maxWidth}`}>
            {text}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] wrap-break-words bg-slate-900 text-white border-slate-800">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
