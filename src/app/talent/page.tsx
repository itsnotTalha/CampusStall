import { redirect } from "next/navigation";

export default function TalentPage() {
  redirect("/explore?type=services");
}
