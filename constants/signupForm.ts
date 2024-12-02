export const signupForm = [
  {
    label: "First Name",
    key: "firstName",
    placeholder: "Enter your first name",
    type: "text", // Text input
  },
  {
    label: "Last Name",
    key: "lastName",
    placeholder: "Enter your last name",
    type: "text", // Text input
  },
  {
    label: "Pronouns",
    key: "pronouns",
    type: "multi-select", // Multiple select input
    options: [
      { label: "She/Her", value: "She/Her" },
      { label: "He/Him", value: "He/Him" },
      { label: "They/Them", value: "They/Them" },
      { label: "Any/All", value: "Any/All" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    label: "Self-Identification (select all that apply)",
    key: "selfIdentification",
    type: "multi-select",
    options: [
      { label: "Woman", value: "Woman" },
      { label: "Indigenous Persons", value: "Indigenous Persons" },
      { label: "Mi'kmaq", value: "Mi'kmaq" },
      { label: "Racialized Persons", value: "Racialized Persons" },
      {
        label: "Person of African or Black Descent",
        value: "Person of African or Black Descent",
      },
      { label: "African Nova Scotian", value: "African Nova Scotian" },
      { label: "Person with Disabilities", value: "Person with Disabilities" },
      { label: "2SLGBTQ+", value: "2SLGBTQ+" },
    ],
  },
  {
    label: "Are you a post-secondary student?",
    key: "isStudent",
    type: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
  },
  {
    label: "Are you currently completing:",
    key: "currentDegree",
    type: "dropdown",
    options: [
      { label: "Diploma", value: "Diploma" },
      { label: "Undergraduate degree", value: "Undergraduate degree" },
      { label: "Masters degree", value: "Masters degree" },
      { label: "PhD", value: "PhD" },
      { label: "Post-doc", value: "Post-doc" },
    ],
  },
  {
    label: "Which faculty or department, or academic program?",
    key: "faculty",
    type: "text",
    placeholder: "Enter your faculty or department",
  },
  {
    label: "In which school are you currently enrolled?",
    key: "school",
    type: "dropdown",
    options: [
      { label: "Dalhousie University", value: "Dalhousie University" },
      {
        label: "University of King's College",
        value: "University of King's College",
      },
      { label: "St. Mary's University", value: "St. Mary's University" },
      { label: "NSCAD University", value: "NSCAD University" },
      {
        label: "Nova Scotia Community College",
        value: "Nova Scotia Community College",
      },
      {
        label: "Mount Saint Vincent University",
        value: "Mount Saint Vincent University",
      },
      { label: "Acadia University", value: "Acadia University" },
      {
        label: "St. Francis Xavier University",
        value: "St. Francis Xavier University",
      },
      { label: "Cape Breton University", value: "Cape Breton University" },
      { label: "Other", value: "Other" },
    ],
  }
];
