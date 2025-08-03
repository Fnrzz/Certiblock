export const certificateTemplate = {
  documentType: "IJAZAH_SARJANA",
  issuingInstitution: {
    name: "Universitas Teknologi Digital",
    address: "Jl. Inovasi No. 123, Kota Cerdas",
    website: "https://utd.ac.id",
  },
  studentDetails: {
    fullName: "%FULL_NAME%",
    studentIdNumber: "%STUDENT_ID_NUMBER%",
  },
  academicDetails: {
    degree: "Sarjana Komputer",
    degreeAbbreviation: "S.Kom.",
    studyProgram: "Teknik Informatika",
    gpa: "%GPA%",
    graduationPredicate: "%GRADUATION_PREDICATE%",
    graduationDate: "%GRADUATION_DATE%",
  },
  validationDetails: {
    diplomaSerialNumber: "%DIPLOMA_SERIAL_NUMBER%",
    nationalDiplomaNumberPin: "%NATIONAL_DIPLOMA_NUMBER_PIN%",
    transcriptSerialNumber: "%TRANSCRIPT_SERIAL_NUMBER%",
    accreditation: {
      level: "Unggul",
      decreeNumber: "123/SK/BAN-PT/Ak/S/VIII/2024",
    },
    issueDate: "%ISSUE_DATE%",
  },
  authorization: {
    rector: {
      name: "Prof. Dr. Ir. H. M. Budi Djatmiko, M.Si., M.E.I.",
      title: "Rektor",
    },
    dean: {
      name: "Dr. T. Sutojo, S.Si., M.Kom.",
      title: "Dekan Fakultas Ilmu Komputer",
    },
  },
};
