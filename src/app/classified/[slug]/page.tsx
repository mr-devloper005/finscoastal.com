import ClassifiedDetailPage, { generateMetadata } from "../../classifieds/[slug]/page";

export const revalidate = 3;
export { generateMetadata };
export default ClassifiedDetailPage;
