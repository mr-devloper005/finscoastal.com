import DetailPage, { generateMetadata } from "../../listings/[slug]/page";


export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 3;
export { generateMetadata };
export default DetailPage;
