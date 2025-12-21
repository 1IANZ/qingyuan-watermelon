CREATE TABLE app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    real_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('farmer', 'enterprise', 'gov')) DEFAULT 'farmer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_no TEXT NOT NULL,
    variety TEXT NOT NULL,
    location TEXT NOT NULL,
    sowing_date DATE NOT NULL,
    status TEXT DEFAULT 'growing',
    quality_report JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE, -- 外键关联批次，批次删了记录也删
    action_type TEXT NOT NULL,
    description TEXT,
    images TEXT[],
    operator TEXT DEFAULT '农户',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE base_varieties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    days INT DEFAULT 90
);


CREATE TABLE base_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'warm'
);

CREATE TABLE base_varieties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    days INT DEFAULT 90
);

CREATE TABLE base_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'warm'
);
