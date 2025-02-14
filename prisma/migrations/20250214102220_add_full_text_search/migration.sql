ALTER TABLE "Product" ADD COLUMN searchVector tsvector;

CREATE INDEX product_search_idx ON "Product" USING GIN (searchVector);

UPDATE "Product" SET searchVector = to_tsvector('spanish', "displayName");

CREATE FUNCTION product_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.searchVector := to_tsvector('spanish', NEW."displayName");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_vector
BEFORE INSERT OR UPDATE ON "Product"
FOR EACH ROW EXECUTE FUNCTION product_search_trigger();
