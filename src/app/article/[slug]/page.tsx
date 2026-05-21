import DetailPage, { generateMetadata } from "../../articles/[slug]/page";

export const revalidate = 3;
export { generateMetadata };
export default DetailPage;
