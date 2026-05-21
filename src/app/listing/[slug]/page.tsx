import DetailPage, { generateMetadata } from "../../listings/[slug]/page";

export const revalidate = 3;
export { generateMetadata };
export default DetailPage;
