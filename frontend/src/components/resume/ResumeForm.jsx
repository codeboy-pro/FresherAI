import { AnimatePresence, motion } from "motion/react";
import {
  FiPlus,
  FiTrash2,
  FiBriefcase,
  FiFolder,
  FiBookOpen,
} from "react-icons/fi";

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="min-w-0 w-full">
      <label className="mb-2 block text-xs font-bold text-slate-700 sm:text-sm">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-xs placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4 sm:text-sm"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="min-w-0 w-full">
      <label className="mb-2 block text-xs font-bold text-slate-700 sm:text-sm">
        {label}
      </label>

      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-xs placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:px-4"
      />
    </div>
  );
}

function EntryCard({ children, onRemove, title, number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="mb-5 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-extrabold text-indigo-700">
            {number}
          </span>
          <h3 className="truncate text-xs font-extrabold text-slate-800 sm:text-sm">
            {title}
          </h3>
        </div>

        <motion.button
          type="button"
          onClick={onRemove}
          whileTap={{ scale: 0.92 }}
          aria-label={`Remove ${title}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <FiTrash2 />
        </motion.button>
      </div>

      <div className="grid min-w-0 gap-4 p-3 sm:gap-5 sm:p-5">{children}</div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center sm:px-5 sm:py-9">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 sm:h-12 sm:w-12">
        <Icon className="text-xl" />
      </div>

      <h3 className="text-sm font-extrabold text-slate-700">{title}</h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function AddButton({ children, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 sm:w-auto sm:px-5 sm:text-sm"
    >
      <FiPlus className="text-lg" />
      {children}
    </motion.button>
  );
}

const ResumeForm = ({ step, data, setData }) => {
  // STEP 1: PERSONAL INFORMATION
  if (step === 1) {
    return (
      <div className="min-w-0 space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
            Let's start with your details
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Add your contact information so recruiters can reach you.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <Input
            label="Full Name"
            placeholder="Your full name"
            value={data.name}
            onChange={(v) => setData({ ...data, name: v })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(v) => setData({ ...data, email: v })}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={data.phone}
            onChange={(v) => setData({ ...data, phone: v })}
          />

          <Input
            label="Location"
            placeholder="City, Country"
            value={data.location}
            onChange={(v) => setData({ ...data, location: v })}
          />

          <Input
            label="LinkedIn Profile"
            placeholder="https://linkedin.com/in/username"
            value={data.linkedin}
            onChange={(v) => setData({ ...data, linkedin: v })}
          />

          <Input
            label="GitHub Profile"
            placeholder="https://github.com/username"
            value={data.github}
            onChange={(v) => setData({ ...data, github: v })}
          />
        </div>

        <p className="rounded-xl bg-indigo-50 px-3 py-3 text-xs leading-5 text-indigo-700 sm:px-4">
          Tip: Use professional contact details and working profile links.
        </p>
      </div>
    );
  }

  // STEP 2: PROFESSIONAL SUMMARY
  if (step === 2) {
    return (
      <div className="min-w-0 space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
            Introduce yourself professionally
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Summarize your background, strengths and career direction.
          </p>
        </div>

        <TextArea
          label="Professional Summary"
          placeholder="Example: Information Technology student with experience building full-stack web applications..."
          value={data.summary}
          rows={7}
          onChange={(v) => setData({ ...data, summary: v })}
        />

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 sm:p-4">
          <p className="text-xs font-extrabold text-indigo-700">Writing tip</p>
          <p className="mt-1 text-xs leading-5 text-indigo-700/80">
            Keep your summary concise. Highlight your strongest technical
            skills, relevant experience and the type of role you are targeting.
          </p>
        </div>

        <p className="text-xs font-medium text-slate-400">
          This section is optional. You can leave it empty.
        </p>
      </div>
    );
  }

  // STEP 3: SKILLS
  if (step === 3) {
    return (
      <div className="min-w-0 space-y-5">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
            Highlight your technical skills
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Include programming languages, frameworks, databases and tools.
          </p>
        </div>

        <TextArea
          label="Technical Skills"
          placeholder="C++, JavaScript, React, Node.js, MongoDB, Docker..."
          value={data.skills}
          rows={5}
          onChange={(v) => setData({ ...data, skills: v })}
        />

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 sm:p-4">
          <p className="text-xs font-extrabold text-indigo-700">
            Separate skills using commas
          </p>
          <p className="mt-1 text-xs leading-5 text-indigo-700/80">
            Add only the technologies and tools you can confidently discuss in
            an interview.
          </p>
        </div>
      </div>
    );
  }

  // STEP 4: EXPERIENCE
  if (step === 4) {
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
      setData({ ...data, experience: updated });
    };

    return (
      <div className="min-w-0">
        <div className="mb-5">
          <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
            Your professional experience
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Add jobs, internships and other relevant professional experience.
          </p>
        </div>

        {data.experience.length === 0 && (
          <EmptyState
            icon={FiBriefcase}
            title="No experience added yet"
            description="Add your internships, jobs or relevant work experience. You can also skip this section."
          />
        )}

        <AnimatePresence mode="popLayout">
          {data.experience.map((exp, index) => (
            <EntryCard
              key={index}
              number={index + 1}
              title={`Experience ${index + 1}`}
              onRemove={() => removeExp(index)}
            >
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Input
                  label="Company"
                  placeholder="Company name"
                  value={exp.company}
                  onChange={(v) => updateExp(index, "company", v)}
                />

                <Input
                  label="Job Title / Role"
                  placeholder="Software Developer Intern"
                  value={exp.role}
                  onChange={(v) => updateExp(index, "role", v)}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Duration"
                    placeholder="June 2026 - August 2026"
                    value={exp.duration}
                    onChange={(v) => updateExp(index, "duration", v)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <TextArea
                    label="Responsibilities & Achievements"
                    placeholder={
                      "Developed REST APIs...\nImproved application performance...\nWorked with a team of developers..."
                    }
                    rows={5}
                    value={exp.description}
                    onChange={(v) => updateExp(index, "description", v)}
                  />
                </div>
              </div>
            </EntryCard>
          ))}
        </AnimatePresence>

        <AddButton onClick={addExp}>Add Experience</AddButton>
      </div>
    );
  }

  // STEP 5: PROJECTS
  if (step === 5) {
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
      setData({ ...data, projects: updated });
    };

    return (
      <div className="min-w-0">
        <div className="mb-5">
          <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
            Showcase what you have built
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Add projects that demonstrate your technical knowledge and
            problem-solving ability.
          </p>
        </div>

        {data.projects.length === 0 && (
          <EmptyState
            icon={FiFolder}
            title="No projects added yet"
            description="Add your academic, personal or open-source projects to demonstrate your skills."
          />
        )}

        <AnimatePresence mode="popLayout">
          {data.projects.map((project, index) => (
            <EntryCard
              key={index}
              number={index + 1}
              title={`Project ${index + 1}`}
              onRemove={() => removeProject(index)}
            >
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Input
                  label="Project Name"
                  placeholder="AI Interview Platform"
                  value={project.name}
                  onChange={(v) => updateProject(index, "name", v)}
                />

                <Input
                  label="Technology Stack"
                  placeholder="React, Node.js, MongoDB"
                  value={project.techStack}
                  onChange={(v) => updateProject(index, "techStack", v)}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Project Link"
                    placeholder="https://github.com/username/project"
                    value={project.github}
                    onChange={(v) => updateProject(index, "github", v)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <TextArea
                    label="Project Description"
                    placeholder={
                      "Built a full-stack application...\nImplemented authentication and REST APIs...\nImproved performance using..."
                    }
                    rows={5}
                    value={project.description}
                    onChange={(v) => updateProject(index, "description", v)}
                  />
                </div>
              </div>
            </EntryCard>
          ))}
        </AnimatePresence>

        <AddButton onClick={addProject}>Add Project</AddButton>
      </div>
    );
  }

  // STEP 6: EDUCATION
  if (step === 6) {
    const addEducation = () => {
      setData({
        ...data,
        education: [
          ...data.education,
          { college: "", degree: "", branch: "", cgpa: "", year: "" },
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
      setData({ ...data, education: updated });
    };

    return (
      <div className="min-w-0">
        <div className="mb-5">
          <h3 className="text-sm font-extrabold text-slate-800 sm:text-base">
            Your academic background
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Add your degrees, institutions and academic details.
          </p>
        </div>

        {data.education.length === 0 && (
          <EmptyState
            icon={FiBookOpen}
            title="No education added yet"
            description="Add your college, university or school details to complete your academic profile."
          />
        )}

        <AnimatePresence mode="popLayout">
          {data.education.map((education, index) => (
            <EntryCard
              key={index}
              number={index + 1}
              title={`Education ${index + 1}`}
              onRemove={() => removeEducation(index)}
            >
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="sm:col-span-2">
                  <Input
                    label="Institution"
                    placeholder="University / College name"
                    value={education.college}
                    onChange={(v) => updateEducation(index, "college", v)}
                  />
                </div>

                <Input
                  label="Degree"
                  placeholder="Bachelor of Technology"
                  value={education.degree}
                  onChange={(v) => updateEducation(index, "degree", v)}
                />

                <Input
                  label="Branch / Major"
                  placeholder="Information Technology"
                  value={education.branch}
                  onChange={(v) => updateEducation(index, "branch", v)}
                />

                <Input
                  label="CGPA / Percentage"
                  placeholder="8.5 CGPA"
                  value={education.cgpa}
                  onChange={(v) => updateEducation(index, "cgpa", v)}
                />

                <Input
                  label="Duration / Graduation Year"
                  placeholder="2024 - 2028"
                  value={education.year}
                  onChange={(v) => updateEducation(index, "year", v)}
                />
              </div>
            </EntryCard>
          ))}
        </AnimatePresence>

        <AddButton onClick={addEducation}>Add Education</AddButton>
      </div>
    );
  }

  return null;
};

export default ResumeForm;
