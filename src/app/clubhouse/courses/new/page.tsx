import type { Metadata } from "next";
import { Suspense } from "react";
import { Placeholder } from "../../_components/Placeholder";
import { AddCourseForm } from "./AddCourseForm";

export const metadata: Metadata = {
  title: "Add a course",
  description: "Add a course from its scorecard: holes, par, tees, rating, and slope.",
};

export default function AddCoursePage() {
  return (
    <Suspense fallback={<Placeholder label="Opening the form" />}>
      <AddCourseForm />
    </Suspense>
  );
}
