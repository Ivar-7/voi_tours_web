import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";

import Alert from "@shared/components/ui/Alert";
import Skeleton from "@shared/components/ui/Skeleton";
import { useProfile } from "../hooks/useProfile";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileForm from "../components/ProfileForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import TierBadge from "../components/TierBadge";

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-card border border-border bg-surface p-6 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <p className="mt-0.5 text-sm text-text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function ProfilePage() {
  const { data: profile, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Skeleton height={160} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton height={320} />
          <Skeleton height={320} />
        </div>
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
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header card */}
      <section className="overflow-hidden rounded-card border border-border bg-surface shadow-card">
        <div className="h-24 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-800" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="-mt-10 rounded-full border-4 border-surface bg-surface">
              <ProfileAvatar
                name={profile.full_name || profile.email}
                avatarUrl={profile.avatar_url}
              />
            </div>
            <div className="pb-1">
              <h1 className="font-serif text-2xl font-bold text-text-primary">
                {profile.full_name || "Your profile"}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-text-muted">
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-1">
            <TierBadge tier={profile.tier} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1 text-sm font-medium capitalize text-text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.role}
            </span>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <SectionCard
          icon={UserRound}
          title="Profile details"
          description="Your name and contact information."
        >
          <ProfileForm profile={profile} />
        </SectionCard>

        <SectionCard
          icon={KeyRound}
          title="Change password"
          description="Use at least 8 characters. You'll stay signed in."
        >
          <PasswordChangeForm />
        </SectionCard>
      </div>

      <p className="text-center text-xs text-text-muted">
        Tier and role are set by our team — contact support if yours needs
        updating.
      </p>
    </div>
  );
}
