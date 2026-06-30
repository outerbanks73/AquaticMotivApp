import type { Metadata } from "next";
import CareGuidesLayout from "./a/careguides/layout";
import CareGuidesHubPage, { metadata as careGuidesMetadata } from "./a/careguides/page";

export const metadata: Metadata = {
  ...careGuidesMetadata,
  title: "Freshwater Aquarium Care Guides | Aquatic Motiv",
};

export default function HomePage() {
  return (
    <CareGuidesLayout>
      <CareGuidesHubPage />
    </CareGuidesLayout>
  );
}
