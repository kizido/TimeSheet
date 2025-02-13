import type { LoaderFunctionArgs } from "react-router";
import { requireAuthCookie } from "~/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    let userId = await requireAuthCookie(request);
}

export default function SheetList() {
  return <div>Sheet List</div>;
}
