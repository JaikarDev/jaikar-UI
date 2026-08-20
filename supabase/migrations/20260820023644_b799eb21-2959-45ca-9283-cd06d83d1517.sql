CREATE TABLE public.assistant_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  project_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX assistant_messages_session_idx ON public.assistant_messages (session_id, created_at);
GRANT ALL ON public.assistant_messages TO service_role;
ALTER TABLE public.assistant_messages ENABLE ROW LEVEL SECURITY;