BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "sellers" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"student_id"	text,
	"year"	integer,
	"institute"	text,
	"major"	text,
	"picture_student_id"	blob,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "members" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"username"	text,
	"password"	text,
	"email"	text,
	"first_name"	text,
	"last_name"	text,
	"phone_number"	text,
	"address"	text,
	"pic_profile"	blob,
	"seller_id"	integer,
	CONSTRAINT "fk_members_seller" FOREIGN KEY("seller_id") REFERENCES "sellers"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "products" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"title"	text,
	"description"	text,
	"price"	real,
	"picproduct"	blob,
	"condition"	text,
	"weigth"	real,
	"status"	text,
	"seller_id"	integer,
	CONSTRAINT "fk_sellers_products" FOREIGN KEY("seller_id") REFERENCES "sellers"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE INDEX IF NOT EXISTS "idx_sellers_deleted_at" ON "sellers" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_members_deleted_at" ON "members" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_products_deleted_at" ON "products" (
	"deleted_at"
);
COMMIT;
