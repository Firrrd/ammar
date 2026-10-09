import { Button } from "@/components/ui/Button";
import { CvIcon } from "@/components/ui/icons";
import { profile } from "@/content/profile";

/** The "CV" button, used in the top bar and the profile header, so the two always match. */
export function CvButton() {
  return (
    <Button href={profile.cvUrl} target="_blank">
      <CvIcon aria-hidden="true" className="h-3.5 w-3.5" />
      CV
    </Button>
  );
}
