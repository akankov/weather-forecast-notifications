-- CreateTable
CREATE TABLE User (
    id          INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    email       TEXT    NOT NULL,
    phoneNumber TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    latitude    REAL    NOT NULL,
    longitude   REAL    NOT NULL,
    timezone    TEXT    NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX User_email_key ON User (email);

-- CreateIndex
CREATE UNIQUE INDEX User_phoneNumber_key ON User (phoneNumber);
