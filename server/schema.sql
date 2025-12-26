-- Krijimi i tabelës së pacientëve
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    birth_date DATE
);

-- Krijimi i tabelës së takimeve (appointments)
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    doctor_name VARCHAR(100),
    appointment_date TIMESTAMP,
    reason TEXT
);