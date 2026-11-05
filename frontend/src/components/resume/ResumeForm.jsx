import { motion } from "motion/react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="mb-4">
      <label> {label} </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="mb-4">
      <label> {label} </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EntryCard({ children, onRemove }) {
  return (
    <div>
      <button onClick={onRemove}>
        <FiTrash2 />
      </button>
      <div>{children}</div>
    </div>
  );
}

const ResumeForm = ({ step, data, setData }) => {
  if (step === 1) {
    return (
      <div>
        <Input
          label="Full Name"
          placeholder="Pradip Maity"
          onChange={(v) => setData({ ...data, name: v })}
          value={data.name}
        />
        <Input
          label="Email"
          placeholder="pradip@example.com"
          onChange={(v) => setData({ ...data, email: v })}
          value={data.email}
        />
        <Input
          label="Phone"
          placeholder="123-456-7890"
          onChange={(v) => setData({ ...data, phone: v })}
          value={data.phone}
        />
        <Input
          label="Location"
          placeholder="Kolkata, India"
          onChange={(v) => setData({ ...data, location: v })}
          value={data.location}
        />
        <Input
          label="LinkedIn"
          placeholder="linkedin.com/in/username"
          onChange={(v) => setData({ ...data, linkedin: v })}
          value={data.linkedin}
        />
        <Input
          label="GitHub"
          placeholder="github.com/username"
          onChange={(v) => setData({ ...data, github: v })}
          value={data.github}
        />
      </div>
    );
  } else if (step === 2) {
    return (
      <div>
        <TextArea
          label="Professional Summary"
          placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
          value={data.summary}
          rows={5}
          onChange={(v) => setData({ ...data, summary: v })}
        />
        <p>Leave empty to skip this section.</p>
      </div>
    );
  } else if (step === 3) {
    return (
      <div>
        <TextArea
          label="Skills (comma separated)"
          placeholder="JavaScript, TypeScript, React, Node.js, MongoDB,Redis,Docker,AWS,Git..."
          value={data.skills}
          rows={4}
          onChange={(v) => setData({ ...data, skills: v })}
        />
        <p>Separate each skills with a comma.</p>
      </div>
    );
  } else if (step === 4) {
    const addExp = () => {
      setData({
        ...data,
        experience: [
          ...data.experience,
          { company: "", role: "", duration: "", description: "" },
        ],
      });
    };
    const removeExp = (index) => {
      setData({
        ...data,
        experience: data.experience.filter((_, i) => i !== index),
      });
    };
    const updateExp = (index, field, value) => {
      const updated = data.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      );
      setData({
        ...data,
        experience: updated,
      });
    };
    return (
      <div>
        {data.experience.length === 0 && (
          <p>No experience added yet. Click below to add. </p>
        )}
        {data.experience.map((exp, index) => (
          <EntryCard key={index} onRemove={() => removeExp(index)}>
            <Input
              label="Company"
              placeholder="ABC Technologies"
              onChange={(v) => updateExp(index, "company", v)}
              value={exp.company}
            />
            <Input
              label="Role"
              placeholder="Backend Engineer"
              onChange={(v) => updateExp(index, "role", v)}
              value={exp.role}
            />
            <Input
              label="Duration"
              placeholder="Jan 2023 - Dec 2024"
              onChange={(v) => updateExp(index, "duration", v)}
              value={exp.duration}
            />
            <TextArea
              label="Description"
              placeholder="Built REST APIs\nImproved performance by 40%"
              onChange={(v) => updateExp(index, "description", v)}
              value={exp.description}
            />
          </EntryCard>
        ))}

        <button onClick={addExp}>
          <FiPlus />
          Add Experience
        </button>
      </div>
    );
  } else if (step === 5) {
    const addProject = () => {
      setData({
        ...data,
        projects: [
          ...data.projects,
          { name: "", techStack: "", github: "", description: "" },
        ],
      });
    };
    const removeProject = (index) => {
      setData({
        ...data,
        projects: data.projects.filter((_, i) => i !== index),
      });
    };
    const updateProject = (index, field, value) => {
      const updated = data.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project,
      );
      setData({
        ...data,
        projects: updated,
      });
    };
    return (
      <div>
        {data.projects.length === 0 && (
          <p>No projects added yet. Click below to add.</p>
        )}
        {data.projects.map((project, index) => (
          <EntryCard key={index} onRemove={() => removeProject(index)}>
            <Input
              label="Project Name"
              placeholder="E-commerce Application"
              onChange={(v) => updateProject(index, "name", v)}
              value={project.name}
            />
            <Input
              label="Tech Stack"
              placeholder="React, Node.js, MongoDB"
              onChange={(v) => updateProject(index, "techStack", v)}
              value={project.techStack}
            />
            <Input
              label="Project Link"
              placeholder="github.com/username/project"
              onChange={(v) => updateProject(index, "github", v)}
              value={project.github}
            />
            <TextArea
              label="Description"
              placeholder={"Built REST APIs\nImproved performance by 40%"}
              onChange={(v) => updateProject(index, "description", v)}
              value={project.description}
            />
          </EntryCard>
        ))}

        <button onClick={addProject}>
          <FiPlus />
          Add Project
        </button>
      </div>
    );
  } else if (step === 6) {
    const addEducation = () => {
      setData({
        ...data,
        education: [
          ...data.education,
          { college: "", degree: "", branch: "", cgpa:"", year: "" },
        ],
      });
    };
    const removeEducation = (index) => {
      setData({
        ...data,
        education: data.education.filter((_, i) => i !== index),
      });
    };
    const updateEducation = (index, field, value) => {
      const updated = data.education.map((education, i) =>
        i === index ? { ...education, [field]: value } : education,
      );
      setData({
        ...data,
        education: updated,
      });
    };
    return (
      <div>
        {data.education.length === 0 && (
          <p>No education added yet. Click below to add.</p>
        )}
        {data.education.map((education, index) => (
          <EntryCard key={index} onRemove={() => removeEducation(index)}>
            <Input
              label="College"
              placeholder="University of Calcutta"
              onChange={(v) => updateEducation(index, "college", v)}
              value={education.college}
            />
            <Input
              label="Degree"
              placeholder="B.Tech in Computer Science"
              onChange={(v) => updateEducation(index, "degree", v)}
              value={education.degree}
            />
            <Input
              label="Branch"
              placeholder="Computer Science and Engineering"
              onChange={(v) => updateEducation(index, "branch", v)}
              value={education.branch}
            />
            <Input
              label="CGPA"
              placeholder="8.5"
              onChange={(v) => updateEducation(index, "cgpa", v)}
              value={education.cgpa}
            />
            <Input
              label="Year"
              placeholder="2020 - 2024"
              onChange={(v) => updateEducation(index, "year", v)}
              value={education.year}
            />
            
          </EntryCard>
        ))}

        <button onClick={addEducation}>
          <FiPlus />
          Add Education
        </button>
      </div>
    );
  }
};

export default ResumeForm;
