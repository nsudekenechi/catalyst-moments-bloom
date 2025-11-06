-- Harden foreign table access: ensure no API exposure via anon/auth roles
REVOKE ALL ON TABLE "Strip balance" FROM anon;
REVOKE ALL ON TABLE "Strip balance" FROM authenticated;
REVOKE ALL ON TABLE "Strip balance" FROM PUBLIC;
GRANT SELECT ON TABLE "Strip balance" TO service_role;