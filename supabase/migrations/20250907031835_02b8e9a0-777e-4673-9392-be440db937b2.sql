-- Update Rolling Stone price from $25,000 to $250,000
UPDATE publications 
SET price = 250000, updated_at = now()
WHERE name = 'Rolling Stone + (400,000 Guranateed Impressions)' AND price = 25000;