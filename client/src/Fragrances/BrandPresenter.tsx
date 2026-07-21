import { useBrands } from "../hooks/useBrands";

export default function BrandPresenter() {
  const { allBrands } = useBrands();

  return <>Brands page</>;
}
