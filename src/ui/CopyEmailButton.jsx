import { toast } from "sonner";

export default function CopyEmailButton() {
  const handleCopy = async () => {
    await navigator.clipboard.writeText("hey@studioglu.nl");

    toast.success("Email address copied", {
      description: "Paste it into your email to get in touch",
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="cursor-pointer text-base bg-text text-surface font-medium w-full md:w-fit px-4 py-3 mt-4 lg:mt-3 rounded-sm hover:bg-link-hover transition-colors"
    >
      Drop me a mail
    </button>
  );
}
