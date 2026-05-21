import ClassifiedDetailPage, { generateMetadata, generateStaticParams } from "../../classifieds/[slug]/page";

export const revalidate = 3;
export { generateMetadata, generateStaticParams };
export default ClassifiedDetailPage;
