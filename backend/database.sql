
CREATE TYPE user_role AS ENUM ('employee', 'manager');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'closed');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    manager_id INTEGER REFERENCES users(id)
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    created_by_id INTEGER NOT NULL REFERENCES users(id),
    assigned_to_id INTEGER NOT NULL REFERENCES users(id),
    status request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
