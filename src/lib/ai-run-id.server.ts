/** Captures/resends the gateway's X-Lovable-AIG-Run-ID header across calls. */
export function createRunIdFetch(initialRunId?: string | null) {
  let runId = initialRunId ?? null;
  const wrapped: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
    const res = await fetch(input, { ...init, headers });
    const returned = res.headers.get("X-Lovable-AIG-Run-ID");
    if (returned) runId = returned;
    return res;
  };
  return {
    fetch: wrapped,
    get runId() {
      return runId;
    },
  };
}

export function getRunIdFromRequest(request: Request): string | null {
  return request.headers.get("X-Lovable-AIG-Run-ID");
}