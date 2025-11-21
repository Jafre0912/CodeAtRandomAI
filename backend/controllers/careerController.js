const rolesData = require('../data/roles.json');

// --- 1. Skill Gap Analyzer Logic ---
const analyzeSkillGap = (req, res) => {
  try {
    const { role, skills } = req.body;

    if (!role || !skills) {
      return res.status(400).json({ error: "Role and Skills are required." });
    }

    // 1. Normalize Role Matching (Case Insensitive)
    const targetRoleKey = Object.keys(rolesData).find(
      (r) => r.toLowerCase() === role.toLowerCase().trim()
    );

    if (!targetRoleKey) {
      return res.status(404).json({ 
        error: "Role not found. Try 'Frontend Developer', 'Backend Developer', or 'Data Analyst'." 
      });
    }

    const requiredSkills = rolesData[targetRoleKey];
    
    // 2. Normalize User Skills
    // Handle both array input or comma-separated string
    const userSkillsArray = Array.isArray(skills) 
      ? skills 
      : skills.split(',').map(s => s.trim());
    
    const userSkillsLower = userSkillsArray.map(s => s.toLowerCase());

    // 3. Compare
    const matched_skills = requiredSkills.filter(skill => 
      userSkillsLower.includes(skill.toLowerCase())
    );

    const missing_skills = requiredSkills.filter(skill => 
      !userSkillsLower.includes(skill.toLowerCase())
    );

    // 4. Generate Recommendation
    let recommendation = "";
    if (missing_skills.length === 0) {
      recommendation = "You are fully qualified! Time to build a capstone project.";
    } else if (missing_skills.length <= 2) {
      recommendation = `You are very close. Focus deeply on ${missing_skills.join(" and ")}.`;
    } else {
      recommendation = "You have a solid start, but focus on the missing fundamentals before applying.";
    }

    // 5. Return JSON strict format per assignment
    res.json({
      matched_skills,
      missing_skills,
      recommendations: recommendation,
      suggested_learning_order: missing_skills // Simple logic: learn what is missing in order
    });

  } catch (error) {
    console.error("Skill Gap Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- 2. Career Roadmap Logic (Mock AI) ---
const generateRoadmap = (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role) return res.status(400).json({ error: "Role is required" });

    const normalizedRole = role.toLowerCase().trim();
    let roadmap = {};

    // Mock Logic based on Role keyword
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
      // Generic Fallback
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