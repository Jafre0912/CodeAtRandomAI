const rolesData = require('../data/roles.json');
const analyzeSkillGap = (req, res) => {
  try {
    const { role, skills } = req.body;

    if (!role || !skills) {
      return res.status(400).json({ error: "Role and Skills are required." });
    }
    const targetRoleKey = Object.keys(rolesData).find(
      (r) => r.toLowerCase() === role.toLowerCase().trim()
    );

    if (!targetRoleKey) {
      return res.status(404).json({ 
        error: "Role not found. Try 'Frontend Developer', 'Backend Developer', or 'Data Analyst'." 
      });
    }

    const requiredSkills = rolesData[targetRoleKey];
    const userSkillsArray = Array.isArray(skills) 
      ? skills 
      : skills.split(',').map(s => s.trim());
    
    const userSkillsLower = userSkillsArray.map(s => s.toLowerCase());
    const matched_skills = requiredSkills.filter(skill => 
      userSkillsLower.includes(skill.toLowerCase())
    );

    const missing_skills = requiredSkills.filter(skill => 
      !userSkillsLower.includes(skill.toLowerCase())
    );
    let recommendation = "";
    if (missing_skills.length === 0) {
      recommendation = "You are fully qualified! Time to build a capstone project.";
    } else if (missing_skills.length <= 2) {
      recommendation = `You are very close. Focus deeply on ${missing_skills.join(" and ")}.`;
    } else {
      recommendation = "You have a solid start, but focus on the missing fundamentals before applying.";
    }
    res.json({
      matched_skills,
      missing_skills,
      recommendations: recommendation,
      suggested_learning_order: missing_skills 
    });

  } catch (error) {
    console.error("Skill Gap Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateRoadmap = (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) return res.status(400).json({ error: "Role is required" });

    const normalizedRole = role.toLowerCase().trim();
    let roadmap = {};
    if (normalizedRole.includes("backend")) {
      roadmap = {
        phase_1: { duration: "1–2 months", focus: "Java basics, OOP, Git" },
        phase_2: { duration: "2 months", focus: "Spring Boot, SQL, APIs" },
        phase_3: { duration: "1–2 months", focus: "Deployment, Docker, System Design" }
      };
    } else if (normalizedRole.includes("frontend") || normalizedRole.includes("react")) {
      roadmap = {
        phase_1: { duration: "1 month", focus: "HTML, CSS, JS Deep Dive" },
        phase_2: { duration: "2 months", focus: "React, Tailwind, State Management" },
        phase_3: { duration: "1 month", focus: "API Integration, Testing, Deployment" }
      };
    } else if (normalizedRole.includes("data")) {
      roadmap = {
        phase_1: { duration: "1 month", focus: "Excel Advanced, SQL Basics" },
        phase_2: { duration: "2 months", focus: "Python, Pandas, NumPy" },
        phase_3: { duration: "2 months", focus: "Tableau/PowerBI, Statistics" }
      };
    } else {
      roadmap = {
        phase_1: { duration: "1 month", focus: "Computer Science Fundamentals" },
        phase_2: { duration: "2 months", focus: `Core Tools for ${role}` },
        phase_3: { duration: "1 month", focus: "Real-world Projects & Portfolio" }
      };
    }

    res.json({ role, roadmap });

  } catch (error) {
    console.error("Roadmap Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { analyzeSkillGap, generateRoadmap };