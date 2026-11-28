import type { ProfilePayload } from "@/types/user";
import DateOfBirthField from "./DateOfBirthField";
import EmailField from "./EmailField";
import FullNameField from "./FullNameField";
import GenderField from "./GenderField";

interface PersonalInfoFieldsProps {
  values: Pick<ProfilePayload, "fullName" | "email" | "dateOfBirth" | "gender">;
  onChange: {
    text: (field: "fullName" | "email" | "dateOfBirth", value: string) => void;
    gender: (value: ProfilePayload["gender"]) => void;
  };
}

export default function PersonalInfoFields({ values, onChange }: PersonalInfoFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FullNameField
        required
        value={values.fullName}
        onChange={(e) => onChange.text("fullName", e.target.value)}
      />
      <EmailField
        required
        placeholder="you@example.com"
        value={values.email}
        onChange={(e) => onChange.text("email", e.target.value)}
      />
      <DateOfBirthField
        required
        value={values.dateOfBirth}
        onChange={(e) => onChange.text("dateOfBirth", e.target.value)}
      />
      <GenderField value={values.gender} onChange={onChange.gender} />
    </div>
  );
}
