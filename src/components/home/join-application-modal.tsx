"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faCode,
  faFilm,
  faLandmark,
  faPenNib,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

const iconMap: Record<string, IconDefinition> = {
  code: faCode,
  "pen-nib": faPenNib,
  rocket: faRocket,
  film: faFilm,
  "chart-line": faChartLine,
  landmark: faLandmark,
};

type JoinApplicationModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  role: string;
  experience: string;
  lookingFor: string[];
  lookingOther: string;
  skills: string[];
  twitter: string;
  github: string;
  portfolio: string;
  linkedin: string;
  dribbble: string;
  behance: string;
  figma: string;
  companyWebsite: string;
  pitchDeck: string;
  youtube: string;
  tiktok: string;
  calendly: string;
  notion: string;
  organisationWebsite: string;
};

type FormRole = { id: string; name: string; description: string; icon_name: string };
type FormLocation = { id: string; name: string; location_group: string };
type FormSkill = { id: string; name: string; role_name: string };
type FormExperience = { id: string; title: string; subtitle: string; badge: string; badge_class: string };
type FormLookingFor = { id: string; label: string };

type FormConfig = {
  roles: FormRole[];
  locations: FormLocation[];
  skills: FormSkill[];
  experienceOptions: FormExperience[];
  lookingForOptions: FormLookingFor[];
};

const totalSteps = 5;
type FormErrorState = Partial<Record<keyof FormState | "role", string>>;

const stepLabels = [
  "Who you are",
  "Role & skills",
  "Experience",
  "Looking for",
  "Your links",
];

const stepDescriptions = [
  "Name and location",
  "What you do and what you bring",
  "Where you're at",
  "What you want from the ecosystem",
  "So we can find you",
];

const stepTitles = [
  "G'day - who are ya?",
  "What's your thing?",
  "Where are ya at?",
  "What are you chasing?",
  "Where can we find ya?",
];

const stepSubtitles = [
  "Let's start with the basics. We'll use this to personalise your experience.",
  "Pick the role that best describes you, then select your skills. We use this for talent matching and opportunity alerts.",
  "Helps us match you with the right programs - from beginner bounties to senior advisory roles.",
  "Select everything that's relevant. You can update this anytime.",
  "So the ecosystem can discover you. All fields optional - share what you're comfortable with.",
];

type LinkField = {
  key: keyof FormState;
  label: string;
  placeholder: string;
};

const roleLinkFields: Record<string, LinkField[]> = {
  Builder: [
    { key: "github", label: "GitHub", placeholder: "github.com/yourprofile" },
    { key: "portfolio", label: "Portfolio / Website", placeholder: "yoursite.com" },
  ],
  Designer: [
    { key: "dribbble", label: "Dribbble", placeholder: "dribbble.com/yourprofile" },
    { key: "behance", label: "Behance", placeholder: "behance.net/yourprofile" },
    { key: "figma", label: "Figma Portfolio", placeholder: "figma.com/@yourhandle" },
  ],
  Founder: [
    { key: "companyWebsite", label: "Company / Project Website", placeholder: "yourstartup.com" },
    { key: "pitchDeck", label: "Pitch Deck Link", placeholder: "Notion / Drive / DocSend link" },
  ],
  Creative: [
    { key: "youtube", label: "YouTube / Video Channel", placeholder: "youtube.com/@yourchannel" },
    { key: "tiktok", label: "TikTok / Social Channel", placeholder: "tiktok.com/@yourhandle" },
    { key: "portfolio", label: "Portfolio / Media Kit", placeholder: "portfolio link" },
  ],
  Operator: [
    { key: "notion", label: "Notion / Work Samples", placeholder: "notion.so/..." },
    { key: "calendly", label: "Calendly", placeholder: "calendly.com/yourname" },
    { key: "portfolio", label: "Personal Site / Profile", placeholder: "yourprofile.com" },
  ],
  Institution: [
    { key: "organisationWebsite", label: "Organisation Website", placeholder: "company.gov.au / company.com" },
    { key: "portfolio", label: "Case Study / Initiative Page", placeholder: "link to relevant program or initiative" },
  ],
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  role: "",
  experience: "",
  lookingFor: [],
  lookingOther: "",
  skills: [],
  twitter: "",
  github: "",
  portfolio: "",
  linkedin: "",
  dribbble: "",
  behance: "",
  figma: "",
  companyWebsite: "",
  pitchDeck: "",
  youtube: "",
  tiktok: "",
  calendly: "",
  notion: "",
  organisationWebsite: "",
};

export function JoinApplicationModal({ open, onClose }: JoinApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrorState>({});
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [config, setConfig] = useState<FormConfig | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setSubmitted(false);
      setIsSubmitting(false);
      setSubmitError("");
      setFieldErrors({});
      setFormState(initialFormState);
    }
  }, [open]);

  useEffect(() => {
    if (!open || config) return;
    fetch("/api/join-form")
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => {});
  }, [open, config]);

  const roles = config?.roles ?? [];
  const australiaLocations = useMemo(
    () => (config?.locations ?? []).filter((l) => l.location_group === "australia"),
    [config],
  );
  const abroadLocations = useMemo(
    () => (config?.locations ?? []).filter((l) => l.location_group === "abroad"),
    [config],
  );
  const availableSkills = useMemo(
    () => (config?.skills ?? []).filter((s) => s.role_name === formState.role).map((s) => s.name),
    [config, formState.role],
  );
  const experienceOptions = config?.experienceOptions ?? [];
  const lookingForOptions = config?.lookingForOptions ?? [];

  const activeRoleLinkFields = useMemo(
    () => roleLinkFields[formState.role] ?? roleLinkFields.Builder,
    [formState.role],
  );

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  if (!open || !portalTarget) return null;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSelection = (list: string[], value: string) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const validateCurrentStep = () => {
    const nextErrors: FormErrorState = {};

    if (currentStep === 1) {
      if (!formState.firstName.trim()) nextErrors.firstName = "First name is required.";
      if (!formState.lastName.trim()) nextErrors.lastName = "Last name is required.";
      if (!formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email))
        nextErrors.email = "Please enter a valid email.";
      if (!formState.location.trim()) nextErrors.location = "Please select your location.";
    }

    if (currentStep === 2) {
      if (!formState.role.length) nextErrors.role = "Choose one role to continue.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = async () => {
    setSubmitError("");
    if (!validateCurrentStep()) return;

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/join-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!response.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setSubmitError("Could not submit right now. Give it another crack in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevStep = () => {
    setSubmitError("");
    setFieldErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative grid h-[84vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-border-yellowmd bg-surface-base shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:grid-cols-[280px_1fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="hidden border-r border-border-yellow p-6 md:flex md:flex-col">
          <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
            Community onboarding
          </p>
          <h3 className="mt-3 font-display text-2xl font-black leading-tight text-text-primary">
            Join the <span className="text-brand-yellow">squad</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Tell us about yourself and we&apos;ll match you with the right opportunities in the ecosystem.
          </p>
          <div className="mt-6 space-y-3">
            {stepLabels.map((label, index) => {
              const step = index + 1;
              const isActive = step === currentStep && !submitted;
              const isDone = step < currentStep || submitted;
              return (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full border text-xs font-bold ${
                      isDone
                        ? "border-brand-green bg-brand-green text-on-yellow"
                        : isActive
                          ? "border-brand-yellow bg-brand-yellow/10 text-brand-yellow"
                          : "border-border-yellow text-text-muted"
                    }`}
                  >
                    {isDone ? "✓" : String(step).padStart(2, "0")}
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-bold ${isActive ? "text-text-primary" : "text-text-secondary"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-text-muted">{stepDescriptions[index]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-y-auto p-5 md:p-8">
          <div className="mb-4 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border-yellowmd bg-surface-card px-3 py-1.5 text-xs font-bold text-text-secondary transition-colors hover:border-border-yellowhi hover:text-text-primary"
            >
              Close
            </button>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full bg-linear-to-r from-brand-green to-brand-yellow transition-all duration-300"
              style={{ width: submitted ? "100%" : `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {!submitted ? (
            <>
              <div className="mt-6">
                <p className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
                  Step {currentStep} of {totalSteps}
                </p>
                <h4 className="mt-1 font-display text-3xl font-black text-text-primary">{stepTitles[currentStep - 1]}</h4>
                <p className="mt-2 text-sm text-text-secondary">{stepSubtitles[currentStep - 1]}</p>
              </div>

              <div className="mt-6 grow">
                {currentStep === 1 ? (
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">First name</label>
                        <input
                          value={formState.firstName}
                          onChange={(event) => setField("firstName", event.target.value)}
                          placeholder="First name *"
                          className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi ${fieldErrors.firstName ? "border-red-400" : "border-border-yellow"}`}
                        />
                        {fieldErrors.firstName ? <p className="mt-1 text-xs font-bold text-red-300">{fieldErrors.firstName}</p> : null}
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">Last name</label>
                        <input
                          value={formState.lastName}
                          onChange={(event) => setField("lastName", event.target.value)}
                          placeholder="Last name *"
                          className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi ${fieldErrors.lastName ? "border-red-400" : "border-border-yellow"}`}
                        />
                        {fieldErrors.lastName ? <p className="mt-1 text-xs font-bold text-red-300">{fieldErrors.lastName}</p> : null}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">Email address</label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => setField("email", event.target.value)}
                        placeholder="Email address *"
                        className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi ${fieldErrors.email ? "border-red-400" : "border-border-yellow"}`}
                      />
                      {fieldErrors.email ? <p className="mt-1 text-xs font-bold text-red-300">{fieldErrors.email}</p> : null}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">Location</label>
                      <select
                        value={formState.location}
                        onChange={(event) => setField("location", event.target.value)}
                        className={`w-full rounded-lg border bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi ${fieldErrors.location ? "border-red-400" : "border-border-yellow"}`}
                      >
                        <option value="">Select your city / state *</option>
                        <optgroup label="Australia">
                          {australiaLocations.map((loc) => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Building from overseas">
                          {abroadLocations.map((loc) => (
                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                          ))}
                        </optgroup>
                      </select>
                      {fieldErrors.location ? <p className="mt-1 text-xs font-bold text-red-300">{fieldErrors.location}</p> : null}
                    </div>
                  </div>
                ) : null}

                {currentStep === 2 ? (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {roles.map((role) => (
                        <button
                          key={role.name}
                          type="button"
                          onClick={() => {
                            setField("role", role.name);
                            setField("skills", []);
                          }}
                          className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                            formState.role === role.name
                              ? "border-border-yellowhi bg-brand-yellow/10 text-brand-yellow"
                              : "border-border-yellow bg-surface-card text-text-secondary hover:border-border-yellowmd"
                          }`}
                        >
                          <div className="mb-2 flex items-center gap-2 text-sm font-black">
                            <FontAwesomeIcon icon={iconMap[role.icon_name] || faRocket} className="text-sm" />
                            {role.name}
                          </div>
                          <p
                            className={`text-xs font-medium leading-relaxed ${
                              formState.role === role.name ? "text-brand-yellow/90" : "text-text-muted"
                            }`}
                          >
                            {role.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    {fieldErrors.role ? <p className="mt-3 text-xs font-bold text-red-300">{fieldErrors.role}</p> : null}

                    {formState.role && availableSkills.length > 0 ? (
                      <div className="rounded-xl border border-border-yellow bg-surface-card p-4">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                          Skills — select all that apply ({formState.skills.length} selected)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {availableSkills.map((skill) => {
                            const selected = formState.skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => setField("skills", toggleSelection(formState.skills, skill))}
                                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                                  selected
                                    ? "border-border-yellowhi bg-brand-yellow/10 text-brand-yellow"
                                    : "border-border-yellow bg-surface-base text-text-secondary hover:border-border-yellowmd"
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="grid gap-3">
                    {experienceOptions.map((option) => (
                      <button
                        key={option.title}
                        type="button"
                        onClick={() => setField("experience", option.title)}
                        className={`rounded-xl border px-4 py-3 text-left ${
                          formState.experience === option.title
                            ? "border-border-yellowhi bg-brand-yellow/10 text-brand-yellow"
                            : "border-border-yellow bg-surface-card text-text-secondary hover:border-border-yellowmd"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-black">{option.title}</p>
                            <p
                              className={`mt-1 text-xs leading-relaxed ${
                                formState.experience === option.title ? "text-brand-yellow/90" : "text-text-muted"
                              }`}
                            >
                              {option.subtitle}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${option.badge_class}`}
                          >
                            {option.badge}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {currentStep === 4 ? (
                  <div className="grid gap-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {lookingForOptions.map((item) => {
                        const selected = formState.lookingFor.includes(item.label);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setField("lookingFor", toggleSelection(formState.lookingFor, item.label))}
                            className={`rounded-xl border px-4 py-3 text-left text-sm font-bold ${
                              selected
                                ? "border-border-yellowhi bg-brand-yellow/10 text-brand-yellow"
                                : "border-border-yellow bg-surface-card text-text-secondary hover:border-border-yellowmd"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">
                      Anything specific? (optional)
                    </label>
                    <textarea
                      value={formState.lookingOther}
                      onChange={(event) => setField("lookingOther", event.target.value)}
                      rows={4}
                      placeholder="Anything specific? (optional)"
                      className="rounded-lg border border-border-yellow bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi"
                    />
                  </div>
                ) : null}

                {currentStep === 5 ? (
                  <div className="grid gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">Twitter / X</label>
                      <input
                        value={formState.twitter}
                        onChange={(event) => setField("twitter", event.target.value)}
                        placeholder="@yourhandle"
                        className="w-full rounded-lg border border-border-yellow bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi"
                      />
                    </div>
                    {activeRoleLinkFields.map((field) => (
                      <div key={field.key}>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">
                          {field.label}
                        </label>
                        <input
                          value={formState[field.key]}
                          onChange={(event) => setField(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-lg border border-border-yellow bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">LinkedIn (optional)</label>
                      <input
                        value={formState.linkedin}
                        onChange={(event) => setField("linkedin", event.target.value)}
                        placeholder="linkedin.com/in/yourprofile"
                        className="w-full rounded-lg border border-border-yellow bg-surface-card px-4 py-3 text-sm text-text-primary outline-none focus:border-border-yellowhi"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {submitError ? <p className="mt-4 text-sm font-bold text-red-300">{submitError}</p> : null}

              <div className="mt-6 flex items-center justify-between border-t border-border-yellow pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className="rounded-lg border border-border-yellow px-4 py-2 text-sm font-bold text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <p className="font-mono text-xs text-text-muted">
                  {currentStep} / {totalSteps}
                </p>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="rounded-lg bg-brand-yellow px-5 py-2 text-sm font-bold text-on-yellow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {currentStep === totalSteps ? (isSubmitting ? "Submitting..." : "Submit") : "Continue"}
                </button>
              </div>
            </>
          ) : (
            <div className="m-auto max-w-lg text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-green text-2xl font-black text-on-yellow">
                ✓
              </div>
              <h4 className="mt-5 font-display text-4xl font-black text-text-primary">
                You&apos;re in, <span className="text-brand-yellow">{formState.firstName || "mate"}</span>!
              </h4>
              <p className="mt-3 text-sm text-text-secondary">
                Thanks for applying. We&apos;ll reach out with opportunities matched to your profile.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {[formState.role, formState.experience, ...formState.skills.slice(0, 3)]
                  .filter(Boolean)
                  .map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border-yellowmd bg-brand-yellow/10 px-3 py-1 text-xs font-bold text-brand-yellow"
                    >
                      {item}
                    </span>
                  ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 rounded-lg bg-brand-yellow px-5 py-2 text-sm font-bold text-on-yellow"
              >
                Close
              </button>
            </div>
          )}
        </main>
      </div>
    </div>,
    portalTarget,
  );
}
