import { RedirectPage } from "@/components/RedirectPage";
import { AGE_PRIVACY } from "@/lib/routes";

export default function LegacyPrivacyPage() {
  return <RedirectPage href={AGE_PRIVACY} />;
}
