export const OPEN_JOIN_APPLICATION_MODAL_EVENT = "open-join-application-modal";

export function openJoinApplicationModal() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(OPEN_JOIN_APPLICATION_MODAL_EVENT));
}
