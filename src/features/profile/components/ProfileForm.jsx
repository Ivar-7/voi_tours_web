import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import TierBadge from "./TierBadge";

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

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Email" value={profile.email} disabled readOnly />
        <div>
          <p className="mb-1.5 block text-sm font-medium text-text-primary">
            Tier &amp; role
          </p>
          <div className="flex items-center gap-2">
            <TierBadge tier={profile.tier} />
            <span className="rounded-full bg-surface-raised px-3 py-1 text-sm font-medium text-text-secondary">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Tier and role are set by our team — contact support if yours needs
        updating.
      </p>

      <Button type="submit" loading={isPending} className="self-start">
        Save changes
      </Button>
    </form>
  );
}
