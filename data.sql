-- 프로필 및 관련 세부 항목 -------------------------------------------------
CREATE TABLE profile (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    phone_number TEXT,
    email        TEXT,
    introduction TEXT,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE career (
    id          SERIAL PRIMARY KEY,
    profile_id  INT REFERENCES profile(id) ON DELETE CASCADE,
    role        VARCHAR(100),
    start_date  DATE,
    end_date    DATE,
    company     VARCHAR(100),
    department  VARCHAR(100),
    position    VARCHAR(100),
    description TEXT
);

CREATE TABLE education (
    id           SERIAL PRIMARY KEY,
    profile_id   INT REFERENCES profile(id) ON DELETE CASCADE,
    major        VARCHAR(100),
    start_date   DATE,
    end_date     DATE,
    institution  VARCHAR(100),
    description  TEXT
);


CREATE TABLE skills (
    id          SERIAL PRIMARY KEY,
    profile_id  INT REFERENCES profile(id) ON DELETE CASCADE,
    category    VARCHAR(50),  -- ex: "인프라","CI/CD","언어"
    skill       TEXT
);

CREATE TABLE certification (
    id           SERIAL PRIMARY KEY,
    profile_id   INT REFERENCES profile(id) ON DELETE CASCADE,
    name         VARCHAR(100),
    issue_date   DATE,
    issuer       VARCHAR(100),
    serial    VARCHAR(100)
);

CREATE TABLE aboutme (
    id           SERIAL PRIMARY KEY,
    profile_id   INT REFERENCES profile(id) ON DELETE CASCADE,
    title        VARCHAR(100),
    content      TEXT
);

-- Projects ----------------------------------------------------------------
CREATE TABLE project (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    start_date    DATE,
    end_date      DATE,
    overview      TEXT,
    role          TEXT,
    skills        TEXT,
    achievements  TEXT,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

-- Work Log ---------------------------------------------------------------
CREATE TABLE work_log (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(200),
    detail_link   TEXT,
    problem       TEXT,
    cause         TEXT,
    resolution    TEXT,
    result        TEXT,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Lab / 실험 -------------------------------------------------------------
CREATE TABLE lab (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(200),
    purpose        TEXT,
    environment    TEXT,
    process        TEXT,
    results        TEXT,
    applicability  TEXT,
    limitations    TEXT,
    created_at     TIMESTAMP DEFAULT NOW()
);