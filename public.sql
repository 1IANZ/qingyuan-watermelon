/*
 Navicat Premium Dump SQL

 Source Server         : PostgreSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 180001 (180001)
 Source Host           : localhost:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 180001 (180001)
 File Encoding         : 65001

 Date: 21/12/2025 21:25:18
*/


-- ----------------------------
-- Table structure for app_users
-- ----------------------------
DROP TABLE IF EXISTS "public"."app_users";
CREATE TABLE "public"."app_users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "username" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "real_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" text COLLATE "pg_catalog"."default" DEFAULT 'farmer'::text,
  "created_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of app_users
-- ----------------------------
INSERT INTO "public"."app_users" VALUES ('b2d1b78c-df59-4f62-ab56-8e3a5aea359b', 'admin', '123456', '绿源精品西瓜合作社', 'farmer', '2025-12-20 13:12:26.083951+00');
INSERT INTO "public"."app_users" VALUES ('db9fdd73-5813-4140-8979-27545d96ae82', 'gov', '123456', '清苑区农业农村局', 'gov', '2025-12-20 13:12:26.083951+00');
INSERT INTO "public"."app_users" VALUES ('fd776411-40ef-4630-8f31-3847537c838e', 'company', '123456', '鲜达供应链管理有限公司', 'enterprise', '2025-12-21 12:14:17.837125+00');

-- ----------------------------
-- Table structure for base_locations
-- ----------------------------
DROP TABLE IF EXISTS "public"."base_locations";
CREATE TABLE "public"."base_locations" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "type" text COLLATE "pg_catalog"."default" DEFAULT 'warm'::text
)
;

-- ----------------------------
-- Records of base_locations
-- ----------------------------
INSERT INTO "public"."base_locations" VALUES ('dc6a4b58-0130-4b8c-bad7-5224c5ed784d', '清苑示范基地-A区暖棚', 'warm');
INSERT INTO "public"."base_locations" VALUES ('e300a3f7-2396-4747-b689-ad161f032dc9', '清苑示范基地-B区冷棚', 'cold');

-- ----------------------------
-- Table structure for base_varieties
-- ----------------------------
DROP TABLE IF EXISTS "public"."base_varieties";
CREATE TABLE "public"."base_varieties" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "days" int4 DEFAULT 90
)
;

-- ----------------------------
-- Records of base_varieties
-- ----------------------------
INSERT INTO "public"."base_varieties" VALUES ('eaaf1641-9f47-417b-a98e-aa023a57c19c', '麒麟8424', 85);
INSERT INTO "public"."base_varieties" VALUES ('e4479fb9-ca08-4ec2-a596-f70ecb112657', '黑美人', 100);

-- ----------------------------
-- Table structure for batches
-- ----------------------------
DROP TABLE IF EXISTS "public"."batches";
CREATE TABLE "public"."batches" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "batch_no" text COLLATE "pg_catalog"."default" NOT NULL,
  "variety" text COLLATE "pg_catalog"."default" NOT NULL,
  "location" text COLLATE "pg_catalog"."default" NOT NULL,
  "sowing_date" date NOT NULL,
  "status" text COLLATE "pg_catalog"."default" DEFAULT 'growing'::text,
  "quality_report" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz(6) DEFAULT now(),
  "user_id" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of batches
-- ----------------------------
INSERT INTO "public"."batches" VALUES ('7e892165-ac8c-4ff1-abcd-1a0d47246bf7', 'KL-1933', '麒麟8424', '清苑示范基地-A区暖棚', '2025-12-21', 'approved', '{"date": "2025-12-21T13:09:03.415Z", "sugar": "11.2%", "result": "PASS", "inspector": "企业质检部01", "pesticide": "符合标准"}', '2025-12-21 12:32:41.939+00', 'b2d1b78c-df59-4f62-ab56-8e3a5aea359b');

-- ----------------------------
-- Table structure for records
-- ----------------------------
DROP TABLE IF EXISTS "public"."records";
CREATE TABLE "public"."records" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "batch_id" uuid NOT NULL,
  "action_type" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "images" text[] COLLATE "pg_catalog"."default",
  "operator" text COLLATE "pg_catalog"."default" DEFAULT '农户'::text,
  "recorded_at" timestamptz(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of records
-- ----------------------------
INSERT INTO "public"."records" VALUES ('0c68c379-2753-40ca-864e-727479aef18c', '7e892165-ac8c-4ff1-abcd-1a0d47246bf7', 'water', '井水滴灌', '{https://iquvfinodefwowdqjaqq.supabase.co/storage/v1/object/public/watermelon/7e892165-ac8c-4ff1-abcd-1a0d47246bf7/1766320559225.jpg}', '绿源精品西瓜合作社', '2025-12-21 12:36:01.632+00');
INSERT INTO "public"."records" VALUES ('70368655-50c7-4e38-ac86-2b7cf592f680', '7e892165-ac8c-4ff1-abcd-1a0d47246bf7', 'pesticide', '粘虫板, 生物防治, 除草作业, 预防白粉病', '{}', '绿源精品西瓜合作社', '2025-12-21 12:48:08.818+00');

-- ----------------------------
-- Function structure for armor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."armor"(bytea, _text, _text);
CREATE FUNCTION "public"."armor"(bytea, _text, _text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_armor'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for armor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."armor"(bytea);
CREATE FUNCTION "public"."armor"(bytea)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_armor'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for crypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."crypt"(text, text);
CREATE FUNCTION "public"."crypt"(text, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_crypt'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for dearmor
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."dearmor"(text);
CREATE FUNCTION "public"."dearmor"(text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_dearmor'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."decrypt"(bytea, bytea, text);
CREATE FUNCTION "public"."decrypt"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_decrypt'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for decrypt_iv
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."decrypt_iv"(bytea, bytea, bytea, text);
CREATE FUNCTION "public"."decrypt_iv"(bytea, bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_decrypt_iv'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for digest
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."digest"(text, text);
CREATE FUNCTION "public"."digest"(text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_digest'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for digest
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."digest"(bytea, text);
CREATE FUNCTION "public"."digest"(bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_digest'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."encrypt"(bytea, bytea, text);
CREATE FUNCTION "public"."encrypt"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_encrypt'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for encrypt_iv
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."encrypt_iv"(bytea, bytea, bytea, text);
CREATE FUNCTION "public"."encrypt_iv"(bytea, bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_encrypt_iv'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for fips_mode
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."fips_mode"();
CREATE FUNCTION "public"."fips_mode"()
  RETURNS "pg_catalog"."bool" AS '$libdir/pgcrypto', 'pg_check_fipsmode'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for gen_random_bytes
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_random_bytes"(int4);
CREATE FUNCTION "public"."gen_random_bytes"(int4)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_random_bytes'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for gen_random_uuid
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_random_uuid"();
CREATE FUNCTION "public"."gen_random_uuid"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/pgcrypto', 'pg_random_uuid'
  LANGUAGE c VOLATILE
  COST 1;

-- ----------------------------
-- Function structure for gen_salt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_salt"(text, int4);
CREATE FUNCTION "public"."gen_salt"(text, int4)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_gen_salt_rounds'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for gen_salt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."gen_salt"(text);
CREATE FUNCTION "public"."gen_salt"(text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pg_gen_salt'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for hmac
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."hmac"(text, text, text);
CREATE FUNCTION "public"."hmac"(text, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_hmac'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for hmac
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."hmac"(bytea, bytea, text);
CREATE FUNCTION "public"."hmac"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pg_hmac'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_armor_headers
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_armor_headers"(text, OUT "key" text, OUT "value" text);
CREATE FUNCTION "public"."pgp_armor_headers"(IN text, OUT "key" text, OUT "value" text)
  RETURNS SETOF "pg_catalog"."record" AS '$libdir/pgcrypto', 'pgp_armor_headers'
  LANGUAGE c IMMUTABLE STRICT
  COST 1
  ROWS 1000;

-- ----------------------------
-- Function structure for pgp_key_id
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_key_id"(bytea);
CREATE FUNCTION "public"."pgp_key_id"(bytea)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_key_id_w'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt"(bytea, bytea, text);
CREATE FUNCTION "public"."pgp_pub_decrypt"(bytea, bytea, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt"(bytea, bytea);
CREATE FUNCTION "public"."pgp_pub_decrypt"(bytea, bytea)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt"(bytea, bytea, text, text);
CREATE FUNCTION "public"."pgp_pub_decrypt"(bytea, bytea, text, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text);
CREATE FUNCTION "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text, text);
CREATE FUNCTION "public"."pgp_pub_decrypt_bytea"(bytea, bytea, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_decrypt_bytea"(bytea, bytea);
CREATE FUNCTION "public"."pgp_pub_decrypt_bytea"(bytea, bytea)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt"(text, bytea, text);
CREATE FUNCTION "public"."pgp_pub_encrypt"(text, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt"(text, bytea);
CREATE FUNCTION "public"."pgp_pub_encrypt"(text, bytea)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt_bytea"(bytea, bytea);
CREATE FUNCTION "public"."pgp_pub_encrypt_bytea"(bytea, bytea)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_pub_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_pub_encrypt_bytea"(bytea, bytea, text);
CREATE FUNCTION "public"."pgp_pub_encrypt_bytea"(bytea, bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_pub_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt"(bytea, text);
CREATE FUNCTION "public"."pgp_sym_decrypt"(bytea, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt"(bytea, text, text);
CREATE FUNCTION "public"."pgp_sym_decrypt"(bytea, text, text)
  RETURNS "pg_catalog"."text" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_text'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt_bytea"(bytea, text, text);
CREATE FUNCTION "public"."pgp_sym_decrypt_bytea"(bytea, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_decrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_decrypt_bytea"(bytea, text);
CREATE FUNCTION "public"."pgp_sym_decrypt_bytea"(bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_decrypt_bytea'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt"(text, text, text);
CREATE FUNCTION "public"."pgp_sym_encrypt"(text, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt"(text, text);
CREATE FUNCTION "public"."pgp_sym_encrypt"(text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_text'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt_bytea"(bytea, text);
CREATE FUNCTION "public"."pgp_sym_encrypt_bytea"(bytea, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for pgp_sym_encrypt_bytea
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."pgp_sym_encrypt_bytea"(bytea, text, text);
CREATE FUNCTION "public"."pgp_sym_encrypt_bytea"(bytea, text, text)
  RETURNS "pg_catalog"."bytea" AS '$libdir/pgcrypto', 'pgp_sym_encrypt_bytea'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Uniques structure for table app_users
-- ----------------------------
ALTER TABLE "public"."app_users" ADD CONSTRAINT "app_users_username_key" UNIQUE ("username");

-- ----------------------------
-- Checks structure for table app_users
-- ----------------------------
ALTER TABLE "public"."app_users" ADD CONSTRAINT "app_users_role_check" CHECK (role = ANY (ARRAY['farmer'::text, 'gov'::text, 'enterprise'::text]));

-- ----------------------------
-- Primary Key structure for table app_users
-- ----------------------------
ALTER TABLE "public"."app_users" ADD CONSTRAINT "app_users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table base_locations
-- ----------------------------
ALTER TABLE "public"."base_locations" ADD CONSTRAINT "base_locations_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table base_locations
-- ----------------------------
ALTER TABLE "public"."base_locations" ADD CONSTRAINT "base_locations_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table base_varieties
-- ----------------------------
ALTER TABLE "public"."base_varieties" ADD CONSTRAINT "base_varieties_name_key" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table base_varieties
-- ----------------------------
ALTER TABLE "public"."base_varieties" ADD CONSTRAINT "base_varieties_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table batches
-- ----------------------------
ALTER TABLE "public"."batches" ADD CONSTRAINT "batches_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table records
-- ----------------------------
ALTER TABLE "public"."records" ADD CONSTRAINT "records_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table records
-- ----------------------------
ALTER TABLE "public"."records" ADD CONSTRAINT "records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."batches" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
