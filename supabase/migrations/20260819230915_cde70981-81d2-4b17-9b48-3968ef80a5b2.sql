CREATE TABLE public.guestbook_stamps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  note text,
  shape smallint NOT NULL DEFAULT 6,
  hue smallint NOT NULL DEFAULT 0,
  seed integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_guestbook_stamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.name := btrim(NEW.name);
  IF char_length(NEW.name) < 1 OR char_length(NEW.name) > 24 THEN
    RAISE EXCEPTION 'name must be between 1 and 24 characters';
  END IF;
  IF NEW.note IS NOT NULL THEN
    NEW.note := btrim(NEW.note);
    IF char_length(NEW.note) > 90 THEN
      RAISE EXCEPTION 'note must be 90 characters or less';
    END IF;
  END IF;
  NEW.shape := greatest(3, least(12, NEW.shape));
  NEW.hue := greatest(0, least(5, NEW.hue));
  NEW.seed := abs(NEW.seed) % 100000;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_guestbook_stamp_trigger
BEFORE INSERT OR UPDATE ON public.guestbook_stamps
FOR EACH ROW EXECUTE FUNCTION public.validate_guestbook_stamp();

CREATE INDEX guestbook_stamps_created_at_idx ON public.guestbook_stamps (created_at DESC);

GRANT SELECT, INSERT ON public.guestbook_stamps TO anon;
GRANT SELECT, INSERT ON public.guestbook_stamps TO authenticated;
GRANT ALL ON public.guestbook_stamps TO service_role;

ALTER TABLE public.guestbook_stamps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view guestbook stamps"
ON public.guestbook_stamps FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Anyone can leave a guestbook stamp"
ON public.guestbook_stamps FOR INSERT TO anon, authenticated WITH CHECK (true);