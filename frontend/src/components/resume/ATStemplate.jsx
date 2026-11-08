import React from "react";

/* =========================================
   URL HELPERS
========================================= */

const normalizeProfileUrl = (value, baseUrl) => {
  if (!value?.trim()) return "";

  const url = value.trim();

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (/^www\./i.test(url) || /^(linkedin\.com|github\.com)\//i.test(url)) {
    return `https://${url}`;
  }

  return `${baseUrl}${url.replace(/^@/, "").replace(/^\/+/, "")}`;
};

const normalizeProjectUrl = (value) => {
  if (!value?.trim()) return "";

  const url = value.trim();

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (/^www\./i.test(url) || /^[\w-]+(\.[\w-]+)+/.test(url)) {
    return `https://${url}`;
  }

  return `https://github.com/${url.replace(/^@/, "").replace(/^\/+/, "")}`;
};

/* =========================================
   REUSABLE RESUME SECTION
========================================= */

const ResumeSection = ({ title, children }) => (
  <section
    style={{
      marginTop: "17px",
      width: "100%",
      breakInside: "auto",
    }}
  >
    <h2
      style={{
        margin: "0 0 8px",
        paddingBottom: "5px",
        borderBottom: "1.5px solid #222222",
        color: "#171717",
        fontSize: "13px",
        fontWeight: 800,
        letterSpacing: "0.7px",
        lineHeight: 1.3,
        textTransform: "uppercase",
        breakAfter: "avoid",
      }}
    >
      {title}
    </h2>

    <div
      style={{
        width: "100%",
        fontSize: "13px",
        lineHeight: 1.5,
        color: "#262626",
      }}
    >
      {children}
    </div>
  </section>
);

/* =========================================
   DESCRIPTION / BULLET POINTS
========================================= */

const DescriptionList = ({ text }) => {
  if (!text?.trim()) return null;

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <ul
      style={{
        margin: "5px 0 0",
        paddingLeft: "19px",
        listStyleType: "disc",
        fontSize: "12.5px",
        lineHeight: 1.5,
        color: "#292929",
      }}
    >
      {lines.map((line, index) => (
        <li
          key={index}
          style={{
            marginBottom: "3px",
            paddingLeft: "2px",
            breakInside: "avoid",
          }}
        >
          {line.replace(/^[-*•]\s*/, "")}
        </li>
      ))}
    </ul>
  );
};

/* =========================================
   EXPERIENCE ENTRY
========================================= */

const ExperienceEntry = ({ experience }) => {
  const { company, role, duration, description } = experience;

  return (
    <article
      style={{
        marginBottom: "13px",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          columnGap: "14px",
          rowGap: "3px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "13.5px",
            fontWeight: 750,
            color: "#171717",
          }}
        >
          {role}
        </h3>

        {duration && (
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#404040",
              whiteSpace: "nowrap",
            }}
          >
            {duration}
          </span>
        )}
      </div>

      {company && (
        <p
          style={{
            margin: "2px 0 0",
            fontSize: "12.5px",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#404040",
          }}
        >
          {company}
        </p>
      )}

      <DescriptionList text={description} />
    </article>
  );
};

/* =========================================
   PROJECT ENTRY
========================================= */

const ProjectEntry = ({ project }) => {
  const { name, techStack, github, description } = project;

  const projectUrl = normalizeProjectUrl(github);

  return (
    <article
      style={{
        marginBottom: "13px",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          columnGap: "12px",
          rowGap: "3px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "13.5px",
            fontWeight: 750,
            color: "#171717",
          }}
        >
          {name}
        </h3>

        {projectUrl && (
          <a
            href={projectUrl}
            style={{
              maxWidth: "100%",
              overflowWrap: "anywhere",
              color: "#222222",
              fontSize: "10.5px",
              textDecoration: "underline",
            }}
          >
            {projectUrl}
          </a>
        )}
      </div>

      {techStack && (
        <p
          style={{
            margin: "3px 0 0",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#333333",
          }}
        >
          <strong>Technologies:</strong> {techStack}
        </p>
      )}

      <DescriptionList text={description} />
    </article>
  );
};

/* =========================================
   EDUCATION ENTRY
========================================= */

const EducationEntry = ({ education }) => {
  const { college, degree, branch, cgpa, year } = education;

  return (
    <article
      style={{
        marginBottom: "11px",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          columnGap: "14px",
          rowGap: "3px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "13.5px",
            fontWeight: 750,
            color: "#171717",
          }}
        >
          {[degree, branch].filter(Boolean).join(" in ")}
        </h3>

        {year && (
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#404040",
              whiteSpace: "nowrap",
            }}
          >
            {year}
          </span>
        )}
      </div>

      {college && (
        <p
          style={{
            margin: "3px 0 0",
            fontSize: "12.5px",
            color: "#333333",
          }}
        >
          {college}
        </p>
      )}

      {cgpa && (
        <p
          style={{
            margin: "3px 0 0",
            fontSize: "12px",
            color: "#333333",
          }}
        >
          <strong>CGPA / Percentage:</strong> {cgpa}
        </p>
      )}
    </article>
  );
};

/* =========================================
   MAIN ATS TEMPLATE
========================================= */

const ATSTemplate = ({ data = {} }) => {
  const { name, email, phone, location, linkedin, github, summary, skills } =
    data;

  // Safely read arrays
  const experience = Array.isArray(data.experience)
    ? data.experience.filter(
        (item) =>
          item &&
          [item.company, item.role, item.duration, item.description].some(
            (value) => value?.trim(),
          ),
      )
    : [];

  const projects = Array.isArray(data.projects)
    ? data.projects.filter(
        (item) =>
          item &&
          [item.name, item.techStack, item.github, item.description].some(
            (value) => value?.trim(),
          ),
      )
    : [];

  const education = Array.isArray(data.education)
    ? data.education.filter(
        (item) =>
          item &&
          [item.college, item.degree, item.branch, item.cgpa, item.year].some(
            (value) => value?.trim(),
          ),
      )
    : [];

  // Skills are rendered as plain text
  const skillsList =
    typeof skills === "string"
      ? skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  // Profile links
  const linkedinUrl = normalizeProfileUrl(linkedin, "https://linkedin.com/in/");

  const githubUrl = normalizeProfileUrl(github, "https://github.com/");

  // Contact details
  const contactDetails = [email, phone, location].filter((value) =>
    value?.trim(),
  );

  // Education is prioritized for students and fresh graduates.
  // Keep the newest education entry first when entering details.
  // If experience exists, show it before projects.
  const contentOrder =
    experience.length > 0
      ? ["experience", "projects"]
      : ["projects", "experience"];

  return (
    <div
      id="resume-document"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        padding: "14mm 16mm",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        color: "#171717",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "13px",
        lineHeight: 1.5,
        boxShadow: "0 4px 22px rgba(15, 23, 42, 0.10)",
        overflowWrap: "break-word",
        wordBreak: "normal",
      }}
    >
      {/* =================================
          PERSONAL HEADER
      ================================= */}

      <header
        style={{
          paddingBottom: "13px",
          borderBottom: "2px solid #222222",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#111111",
            fontSize: "29px",
            fontWeight: 800,
            letterSpacing: "-0.7px",
            lineHeight: 1.2,
          }}
        >
          {name || "YOUR NAME"}
        </h1>

        {contactDetails.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "3px 7px",
              marginTop: "9px",
              color: "#333333",
              fontSize: "11.5px",
              lineHeight: 1.5,
            }}
          >
            {contactDetails.map((item, index) => (
              <React.Fragment key={`${item}-${index}`}>
                {index > 0 && <span style={{ color: "#777777" }}>|</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {(linkedinUrl || githubUrl) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 14px",
              marginTop: "5px",
              fontSize: "11.5px",
              lineHeight: 1.5,
            }}
          >
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                style={{
                  color: "#222222",
                  textDecoration: "underline",
                  overflowWrap: "anywhere",
                }}
              >
                {linkedinUrl}
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                style={{
                  color: "#222222",
                  textDecoration: "underline",
                  overflowWrap: "anywhere",
                }}
              >
                {githubUrl}
              </a>
            )}
          </div>
        )}
      </header>

      {/* =================================
          PROFESSIONAL SUMMARY
      ================================= */}

      {summary?.trim() && (
        <ResumeSection title="Professional Summary">
          <p
            style={{
              margin: 0,
              fontSize: "12.5px",
              lineHeight: 1.6,
              color: "#292929",
              whiteSpace: "pre-line",
            }}
          >
            {summary.trim()}
          </p>
        </ResumeSection>
      )}

      {/* =================================
          EDUCATION
      ================================= */}

      {education.length > 0 && (
        <ResumeSection title="Education">
          {education.map((item, index) => (
            <EducationEntry key={index} education={item} />
          ))}
        </ResumeSection>
      )}

      {/* =================================
          TECHNICAL SKILLS
      ================================= */}

      {skillsList.length > 0 && (
        <ResumeSection title="Technical Skills">
          <p
            style={{
              margin: 0,
              fontSize: "12.5px",
              lineHeight: 1.7,
              color: "#292929",
            }}
          >
            {skillsList.join(", ")}
          </p>
        </ResumeSection>
      )}

      {/* =================================
          EXPERIENCE AND PROJECTS
      ================================= */}

      {contentOrder.map((section) => {
        if (section === "experience" && experience.length > 0) {
          return (
            <ResumeSection key="experience" title="Work Experience">
              {experience.map((item, index) => (
                <ExperienceEntry key={index} experience={item} />
              ))}
            </ResumeSection>
          );
        }

        if (section === "projects" && projects.length > 0) {
          return (
            <ResumeSection key="projects" title="Projects">
              {projects.map((item, index) => (
                <ProjectEntry key={index} project={item} />
              ))}
            </ResumeSection>
          );
        }

        return null;
      })}
    </div>
  );
};

export default ATSTemplate;
