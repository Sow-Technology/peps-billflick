import { cn } from "@/lib/utils";

export default function DataCard({
  title,
  icon,
  value,
  onClick,
  className,
  revenue,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 bg-gradient-to-t from-white via-[#6DD5FA] to-[#2980B9] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 space-y-10 py-8  w-full min-w-[180px] flex  flex-col justify-center ",
        className
      )}
    >
      <div className="flex justify-between items-center mb-2 ">
        <div
          className={cn(
            "text-xl lg:text-[1.3vw] font-bold text-slate-50 drop-shadow-2xl  spice",
            revenue
          )}
        >
          {" "}
          {value}
        </div>

        <span className="text-4xl h-8 w-8 block">{icon}</span>
      </div>
      <span className={cn("text-gray-800 lg:text-[1.15vw]  block font-bold")}>
        {title}
      </span>
    </div>
  );
}
