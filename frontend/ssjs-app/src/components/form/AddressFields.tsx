import type { UserAddress } from "@/types/user";
import PincodeField from "./PincodeField";
import TextField from "./TextField";

interface AddressFieldsProps {
  values: UserAddress;
  onChange: (field: keyof UserAddress, value: string) => void;
}

export default function AddressFields({ values, onChange }: AddressFieldsProps) {
  const bind = (field: keyof UserAddress) => ({
    required: true,
    value: values[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value),
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label="Address"
        autoComplete="street-address"
        placeholder="House number, street, area"
        className="sm:col-span-2"
        {...bind("addressLine")}
      />
      <TextField label="City" autoComplete="address-level2" {...bind("city")} />
      <TextField label="State" autoComplete="address-level1" {...bind("state")} />
      <TextField label="Country" autoComplete="country-name" {...bind("country")} />
      <PincodeField {...bind("pincode")} />
    </div>
  );
}
