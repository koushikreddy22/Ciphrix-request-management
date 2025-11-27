
const shell = require('shelljs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { DB_USER, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sqlFile = path.resolve(__dirname, '../database.sql');

// Drop the database if it exists
shell.echo(`Dropping database ${DB_NAME}...`);
if (shell.exec(`psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"`).code !== 0) {
  shell.echo('Error dropping database. You may be prompted for your database password.');
  if (shell.exec(`psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"`).code !== 0) {
    shell.echo('Failed to drop database.');
    shell.exit(1);
  }
}

// Create the database
shell.echo(`Creating database ${DB_NAME}...`);
if (shell.exec(`psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d postgres -c "CREATE DATABASE ${DB_NAME};"`).code !== 0) {
  shell.echo('Error creating database. You may be prompted for your database password.');
  if (shell.exec(`psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d postgres -c "CREATE DATABASE ${DB_NAME};"`).code !== 0) {
    shell.echo('Failed to create database.');
    shell.exit(1);
  }
}

// Run the sql file
shell.echo(`Setting up database ${DB_NAME}...`);
if (shell.exec(`psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -f ${sqlFile}`).code !== 0) {
    shell.echo('Error setting up database. You may be prompted for your database password.');
    if (shell.exec(`psql -U ${DB_USER} -h ${DB_HOST} -p ${DB_PORT} -d ${DB_NAME} -f ${sqlFile}`).code !== 0) {
        shell.echo('Failed to setup database.');
        shell.exit(1);
    }
}

shell.echo('Database setup complete.');
