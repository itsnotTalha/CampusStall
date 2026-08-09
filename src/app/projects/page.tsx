import { redirect } from "next/navigation";

export default function ProjectsPage() {
  redirect("/explore?type=projects");
}
