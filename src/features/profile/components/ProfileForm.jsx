import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

/**
 * @param {{ profile: import('@/shared/types/models').User }} props
 */
export default function ProfileForm({ profile }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      full_name: profile.full_name || "",
      phone: profile.phone || "",
    },
  });

  const { mutate, isPending } = useUpdateProfile();

  function onSubmit(values) {
    mutate(values, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (err) => toast.error(err?.message || "Update failed"),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" {...register("full_name")} />
        <Input label="Phone" placeholder="07XXXXXXXX" {...register("phone")} />
      </div>

      <Input
        label="Email"
        value={profile.email}
        disabled
        readOnly
        hint="Email can't be changed here."
      />

      <Button type="submit" loading={isPending} className="self-start">
        Save changes
      </Button>
    </form>
  );
}
