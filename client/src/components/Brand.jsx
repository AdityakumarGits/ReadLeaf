import { Leaf } from "lucide-react";

const Brand = ({ small = false }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-roseleaf text-ink">
      <Leaf size={22} strokeWidth={2.3} />
    </div>
    <div>
      <p
        className={`${small ? "text-base" : "text-lg"} font-extrabold tracking-tight`}
      >
        bookleaf<span className="text-[#d77b96]">.</span>
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-muted">
        Author care portal
      </p>
    </div>
  </div>
);
export default Brand;
