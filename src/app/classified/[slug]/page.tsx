import ClassifiedDetailPage, { generateMetadata } from "../../classifieds/[slug]/page";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 3;
export { generateMetadata };
export default ClassifiedDetailPage;
