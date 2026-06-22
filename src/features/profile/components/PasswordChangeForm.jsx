import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import { useChangePassword } from "../hooks/useUpdateProfile";

export default function PasswordChangeForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const { mutate, isPending } = useChangePassword();

  function onSubmit(values) {
    mutate(values, {
      onSuccess: () => {
        toast.success("Password updated");
        reset();
      },
      onError: (err) => toast.error(err?.message || "Couldn't change password"),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        type="password"
        label="Current password"
        autoComplete="current-password"
        error={errors.current_password?.message}
        {...register("current_password", { required: "Required" })}
      />
      <Input
        type="password"
        label="New password"
        autoComplete="new-password"
        error={errors.new_password?.message}
        {...register("new_password", {
          required: "Required",
          minLength: { value: 8, message: "At least 8 characters." },
        })}
      />
      <Input
        type="password"
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirm_new_password?.message}
        {...register("confirm_new_password", {
          required: "Required",
          validate: (value) =>
            value === watch("new_password") || "Passwords do not match.",
        })}
      />
      <Button type="submit" loading={isPending} className="self-start">
        Update password
      </Button>
    </form>
  );
}
