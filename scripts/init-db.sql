-- Verificar configuración de búsqueda en español
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_ts_config WHERE cfgname = 'spanish'
  ) THEN
    RAISE EXCEPTION 'Spanish text search configuration not available';
  END IF;
END
$$;

SELECT 'Database initialized with Spanish support' AS status;
