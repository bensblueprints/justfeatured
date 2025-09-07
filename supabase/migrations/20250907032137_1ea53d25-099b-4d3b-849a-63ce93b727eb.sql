-- Change price column from integer to decimal with 2 decimal places for proper currency handling
ALTER TABLE publications 
ALTER COLUMN price TYPE DECIMAL(10,2) USING price::DECIMAL(10,2);