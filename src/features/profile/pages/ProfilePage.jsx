import Alert from "@shared/components/ui/Alert";
import Skeleton from "@shared/components/ui/Skeleton";
import { useProfile } from "../hooks/useProfile";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileForm from "../components/ProfileForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

export default function ProfilePage() {
  const { data: profile, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton height={80} width={80} rounded="full" />
        <Skeleton height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Couldn't load your profile">
        {error.message}
        <button
          type="button"
          onClick={() => refetch()}
          className="ml-2 font-semibold underline"
        >
          Retry
        </button>
      </Alert>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <ProfileAvatar
          name={profile.full_name || profile.email}
          avatarUrl={profile.avatar_url}
        />
        <div>
          <h1 className="font-serif text-2xl font-bold text-text-primary">
            {profile.full_name || "Your profile"}
          </h1>
          <p className="text-sm text-text-muted">{profile.email}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-text-muted">
          Profile details
        </h2>
        <ProfileForm profile={profile} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-text-muted">
          Change password
        </h2>
        <PasswordChangeForm />
      </section>
    </div>
  );
}
