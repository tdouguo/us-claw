import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import type { SetSidecarState } from "../../app/sidecar";
import {
  createTask,
  fetchOrganizationEntities,
  fetchOrganizationRole,
  fetchOrganizationRoles,
  type CreateTaskPayload,
  type EntitySummary,
  type RoleRecord,
  type TaskRecord
} from "../../shared/api";

type OrganizationViewProps = {
  setSidecar: SetSidecarState;
};

type LaunchFormState = {
  title: string;
  description: string;
  missionType: string;
  riskLevel: string;
  reviewRequirements: string[];
};

const REVIEW_OPTIONS = [
  { label: "Legal review", value: "legal_review" },
  { label: "Integration review", value: "integration_review" },
  { label: "Budget or security review", value: "budget_or_security_review" }
];

const INITIAL_FORM_STATE: LaunchFormState = {
  title: "",
  description: "",
  missionType: "general",
  riskLevel: "normal",
  reviewRequirements: []
};

function formatLabel(value: string) {
  return value.split("_").join(" ").replace(/\b\w/g, (char: string) => char.toUpperCase());
}

function buildCreateTaskPayload(role: RoleRecord, form: LaunchFormState): CreateTaskPayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    mission_type: form.missionType,
    risk_level: form.riskLevel,
    owning_entity: role.entity_slug,
    initiating_entity: role.entity_slug,
    initiating_role: role.role_slug,
    launch_context: "Role launch from organization console",
    review_requirements: form.reviewRequirements
  };
}

export function OrganizationView({ setSidecar }: OrganizationViewProps) {
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [selectedEntitySlug, setSelectedEntitySlug] = useState("");
  const [selectedRoleSlug, setSelectedRoleSlug] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null);
  const [createdTask, setCreatedTask] = useState<TaskRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isLoadingEntities, setIsLoadingEntities] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingRoleDetail, setIsLoadingRoleDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LaunchFormState>(INITIAL_FORM_STATE);

  useEffect(() => {
    let cancelled = false;

    setIsLoadingEntities(true);
    fetchOrganizationEntities()
      .then((items) => {
        if (cancelled) {
          return;
        }
        setEntities(items);
        setSelectedEntitySlug(items[0]?.entity_slug ?? "");
        setError(null);
      })
      .catch((reason: Error) => {
        if (!cancelled) {
          setError(reason.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingEntities(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedEntitySlug) {
      setRoles([]);
      setSelectedRoleSlug("");
      setSelectedRole(null);
      return;
    }

    let cancelled = false;

    setRoles([]);
    setSelectedRoleSlug("");
    setSelectedRole(null);
    setIsLoadingRoles(true);
    fetchOrganizationRoles(selectedEntitySlug)
      .then((items) => {
        if (cancelled) {
          return;
        }
        setRoles(items);
        setSelectedRoleSlug(items[0]?.role_slug ?? "");
        setError(null);
      })
      .catch((reason: Error) => {
        if (!cancelled) {
          setRoles([]);
          setSelectedRoleSlug("");
          setSelectedRole(null);
          setError(reason.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingRoles(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedEntitySlug]);

  useEffect(() => {
    if (!selectedEntitySlug || !selectedRoleSlug) {
      setSelectedRole(null);
      return;
    }

    let cancelled = false;

    setIsLoadingRoleDetail(true);
    fetchOrganizationRole(selectedEntitySlug, selectedRoleSlug)
      .then((role) => {
        if (cancelled) {
          return;
        }
        setSelectedRole(role);
      })
      .catch((reason: Error) => {
        if (!cancelled) {
          setError(reason.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingRoleDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedEntitySlug, selectedRoleSlug]);

  useEffect(() => {
    if (createdTask && selectedRole) {
      setSidecar({
        eyebrow: "Task Created",
        title: createdTask.title,
        description: `Draft mission created from ${selectedRole.title_en}.`,
        content: (
          <div className="detail-grid">
            <div>
              <span className="detail-grid__label">Task Id</span>
              <strong>{createdTask.id}</strong>
            </div>
            <div>
              <span className="detail-grid__label">State</span>
              <strong>{createdTask.state}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Risk</span>
              <strong>{createdTask.risk_level}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Review Gates</span>
              <strong>{createdTask.review_requirements.join(", ") || "none"}</strong>
            </div>
          </div>
        )
      });
      return;
    }

    if (!selectedRole) {
      setSidecar({
        eyebrow: selectedEntitySlug || "Organization Intel",
        title: "Role Intelligence",
        description:
          isLoadingRoles || isLoadingRoleDetail
            ? "Loading the selected role context."
            : "Select a role to inspect its details and launch work from it.",
        content: (
          <p className="sidecar-description">
            {error
              ? error
              : "Role details will appear here once the current entity selection resolves."}
          </p>
        )
      });
      return;
    }

    setSidecar({
      eyebrow: selectedRole.entity_slug,
      title: selectedRole.title_en,
      description: `${selectedRole.reference_level} • ${selectedRole.reference_level_name}`,
      content: (
        <>
          <div className="detail-grid">
            <div>
              <span className="detail-grid__label">Entity</span>
              <strong>{selectedRole.entity_en}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Phase</span>
              <strong>{selectedRole.phase}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Family</span>
              <strong>{selectedRole.family || "Not categorized"}</strong>
            </div>
            <div>
              <span className="detail-grid__label">Appointment</span>
              <strong>{selectedRole.appointment_type || "Unspecified"}</strong>
            </div>
          </div>
          <h4 className="section-heading">Source</h4>
          <p className="sidecar-description">{selectedRole.path}</p>
        </>
      )
    });
  }, [
    createdTask,
    error,
    isLoadingRoleDetail,
    isLoadingRoles,
    selectedEntitySlug,
    selectedRole,
    setSidecar
  ]);

  const selectedEntity = useMemo(
    () => entities.find((entity) => entity.entity_slug === selectedEntitySlug) ?? null,
    [entities, selectedEntitySlug]
  );

  const handleReviewToggle = (value: string) => {
    setForm((current) => ({
      ...current,
      reviewRequirements: current.reviewRequirements.includes(value)
        ? current.reviewRequirements.filter((item) => item !== value)
        : [...current.reviewRequirements, value]
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setSubmissionError("Select a role and enter a task title before submitting.");
      return;
    }

    if (
      !selectedRole ||
      selectedRole.entity_slug !== selectedEntitySlug ||
      isLoadingRoles ||
      isLoadingRoleDetail
    ) {
      setSubmissionError("Wait for the selected role to finish loading before submitting.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setSubmissionError(null);

    try {
      const created = await createTask(buildCreateTaskPayload(selectedRole, form));
      setCreatedTask(created);
      setFeedback(`Task ${created.id} created from ${selectedRole.title_en}.`);
      setForm(INITIAL_FORM_STATE);
      setError(null);
      setSubmissionError(null);
    } catch (reason) {
      setSubmissionError(reason instanceof Error ? reason.message : "Task creation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel panel--main">
      <div className="section-header">
        <div>
          <h2>Organization</h2>
          <p className="section-intro">
            Browse entities and roles, then launch control-plane work from the selected role.
          </p>
        </div>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}
      {feedback ? <p className="success-banner">{feedback}</p> : null}
      {submissionError ? <p className="error-banner">{submissionError}</p> : null}

      <div className="org-grid">
        <section className="org-panel">
          <div className="org-panel__header">
            <h3>Entities</h3>
            {isLoadingEntities ? <span className="subtle-text">Loading…</span> : null}
          </div>
          <div className="stack">
            {entities.map((entity) => (
              <button
                className={`entity-card${entity.entity_slug === selectedEntitySlug ? " entity-card--selected" : ""}`}
                key={entity.entity_slug}
                onClick={() => {
                  setCreatedTask(null);
                  setFeedback(null);
                  setSubmissionError(null);
                  setSelectedEntitySlug(entity.entity_slug);
                }}
                type="button"
              >
                <strong>{formatLabel(entity.entity_slug)}</strong>
                <span>{entity.role_count} roles</span>
                <span>{entity.phase}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="org-panel">
          <div className="org-panel__header">
            <h3>Roles</h3>
            {isLoadingRoles ? <span className="subtle-text">Loading…</span> : null}
          </div>
          <div className="stack">
            {roles.map((role) => (
              <button
                aria-label={`Open role ${role.title_en}`}
                className={`role-card${role.role_slug === selectedRoleSlug ? " role-card--selected" : ""}`}
                key={role.role_slug}
                onClick={() => {
                  setCreatedTask(null);
                  setFeedback(null);
                  setSubmissionError(null);
                  setSelectedRoleSlug(role.role_slug);
                }}
                type="button"
              >
                <strong>{role.title_en}</strong>
                <span>{role.reference_level}</span>
                <span>{role.family || "No family"}</span>
              </button>
            ))}
            {!roles.length && !isLoadingRoles ? (
              <p className="subtle-text">No roles found for this entity.</p>
            ) : null}
          </div>
        </section>
      </div>

      <div className="org-launcher">
        <section className="org-panel">
          <div className="org-panel__header">
            <h3>Selected Role</h3>
            {isLoadingRoleDetail ? <span className="subtle-text">Loading…</span> : null}
          </div>
          {selectedRole ? (
            <div className="detail-grid">
              <div>
                <span className="detail-grid__label">English Title</span>
                <strong>{selectedRole.title_en}</strong>
              </div>
              <div>
                <span className="detail-grid__label">Chinese Title</span>
                <strong>{selectedRole.title_cn}</strong>
              </div>
              <div>
                <span className="detail-grid__label">Entity</span>
                <strong>{selectedRole.entity_en}</strong>
              </div>
              <div>
                <span className="detail-grid__label">Reference Level</span>
                <strong>{selectedRole.reference_level_name}</strong>
              </div>
            </div>
          ) : (
            <p className="subtle-text">Select a role to inspect its details.</p>
          )}
        </section>

        <section className="org-panel">
          <div className="org-panel__header">
            <h3>Launch Task</h3>
            {selectedEntity ? <span className="subtle-text">{selectedEntity.entity_slug}</span> : null}
          </div>
          <form className="launch-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Task Title</span>
              <input
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                type="text"
                value={form.title}
              />
            </label>

            <label className="field">
              <span>Description</span>
              <textarea
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                value={form.description}
              />
            </label>

            <div className="filter-grid">
              <label className="field">
                <span>Mission Type</span>
                <select
                  onChange={(event) =>
                    setForm((current) => ({ ...current, missionType: event.target.value }))
                  }
                  value={form.missionType}
                >
                  <option value="general">general</option>
                  <option value="coordination">coordination</option>
                  <option value="litigation">litigation</option>
                  <option value="incident">incident</option>
                </select>
              </label>

              <label className="field">
                <span>Risk Level</span>
                <select
                  onChange={(event) =>
                    setForm((current) => ({ ...current, riskLevel: event.target.value }))
                  }
                  value={form.riskLevel}
                >
                  <option value="normal">normal</option>
                  <option value="high">high</option>
                  <option value="critical">critical</option>
                </select>
              </label>
            </div>

            <fieldset className="field-group">
              <legend>Review Requirements</legend>
              <div className="checkbox-grid">
                {REVIEW_OPTIONS.map((option) => (
                  <label className="checkbox" key={option.value}>
                    <input
                      checked={form.reviewRequirements.includes(option.value)}
                      onChange={() => handleReviewToggle(option.value)}
                      type="checkbox"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              className="primary-button"
              disabled={
                isSubmitting ||
                isLoadingRoles ||
                isLoadingRoleDetail ||
                !form.title.trim() ||
                !selectedRole ||
                selectedRole.entity_slug !== selectedEntitySlug
              }
              type="submit"
            >
              {isSubmitting ? "Creating…" : "Create Task"}
            </button>
          </form>
        </section>
      </div>
    </section>
  );
}
