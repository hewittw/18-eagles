import type { Metadata } from "next";
import { CourseList } from "./CourseList";

export const metadata: Metadata = {
  title: "Courses",
  description: "Choose a course to play: your home course, the majors, and the links of Scotland.",
};

export default function CoursesPage() {
  return <CourseList />;
}
