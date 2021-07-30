DROP TABLE IF EXISTS student;
CREATE TABLE student(
  id SERIAL PRIMARY KEY,
  studentName varchar(255),
  studentPassword varchar(255),
  studentAge varchar(255),
  studentLevel varchar(255),
  studentRole varchar(255)
);

DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher(
  id SERIAL PRIMARY KEY,
  teacherName varchar(255),
  teacherPassword varchar(255),
  teacherSubject varchar(255),
  teacherCourses varchar(255),
  teacherRole varchar(255)
);
DROP TABLE IF EXISTS subjects;
CREATE TABLE subjects(
  id SERIAL PRIMARY KEY,
  subjectName varchar(255)
);


DROP TABLE IF EXISTS course;
CREATE TABLE course(
  id SERIAL PRIMARY KEY,
  courseName varchar(255),
);

DROP TABLE IF EXISTS assigment;

CREATE TABLE assigment(
  id SERIAL PRIMARY KEY,
  assigName varchar(255),
  assigDisc varchar(255)
);

DROP TABLE IF EXISTS exam;
CREATE TABLE exam(
  id SERIAL PRIMARY KEY,
  examName varchar(255),
  examDate DATE,
  answer varchar(255),
  option1 varchar(255),
  option2 varchar(255),
  option3 varchar(255),
  option4 varchar(255)

);