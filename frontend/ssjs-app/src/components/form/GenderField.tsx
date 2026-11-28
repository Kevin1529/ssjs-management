import { GENDER_OPTIONS } from "@/constants/profile";
import type { Gender } from "@/types/user";
import SelectField from "./SelectField";

interface GenderFieldProps {
  value: Gender;
  onChange: (value: Gender) => void;
  className?: string;
}

export default function GenderField(props: GenderFieldProps) {
  return <SelectField label="Gender" options={GENDER_OPTIONS} {...props} />;
}
