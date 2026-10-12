import { RedirectPage } from "@/components/RedirectPage";
import { AGE_TEST } from "@/lib/routes";

export default function LegacyTestPage() {
  return <RedirectPage href={AGE_TEST} />;
}
