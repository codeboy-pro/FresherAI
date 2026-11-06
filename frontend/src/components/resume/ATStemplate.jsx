import React from "react";

const ATStemplate = ({ data }) => {
  const {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    skills,
    experience,
    projects,
    education,
  } = data;
  const skillsList = skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const halfList = Math.ceil(skillsList.length / 2);
  const skillsColl1 = skillsList.slice(0, halfList);
  const skillsColl2 = skillsList.slice(halfList);
  return (
    <div>
      {/* header  */}
      <div>
        <h2>{name || "YOUR NAME"}</h2>
        <div>
          {[
            email,
            phone,
            location,
            linkedin ? `linkdin.com/in/${linkedin}` : null,
            github ? `github.com/${github}` : null,
          ]
            .filter(Boolean)
            .map((v, i, arr) => (
              <span key={i}>
                {v}
                {i < arr.length - 1 && <span>|</span>}
              </span>
            ))}
        </div>
        {/* a line  */}
      </div>

      {summary && (
        <section>
          <h2>Professional Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {skills && (
        <div>
          <section>
            <h2>Technical Skills</h2>
            <div>
              <ul>
                {skillsColl1.map((skill, i) => (
                  <li capitalize key={i}>
                    {skill}
                  </li>
                ))}
              </ul>
              <ul>
                {skillsColl2.map((skill, i) => (
                  <li capitalize key={i}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ATStemplate;
