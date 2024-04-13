import { Spinner } from "@/components/ui/feedback/Spinner";

export function FeedBackLoading() {
  return (
    <div className="flex justify-center w-full py-32">
      <Spinner size={48} />
    </div>
  );
}
