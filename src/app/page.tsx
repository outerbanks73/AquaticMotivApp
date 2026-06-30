import CareGuidesLayout from "./a/careguides/layout";
import CareGuidesHubPage from "./a/careguides/page";

export { metadata } from "./a/careguides/page";

export default function HomePage() {
  return (
    <CareGuidesLayout>
      <CareGuidesHubPage />
    </CareGuidesLayout>
  );
}
