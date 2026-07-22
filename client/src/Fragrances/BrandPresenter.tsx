import { useBrands } from "../hooks/useBrands";

export default function BrandPresenter() {
  const { allBrands } = useBrands();

  console.log(allBrands);

  return <>Brands page</>;
}
