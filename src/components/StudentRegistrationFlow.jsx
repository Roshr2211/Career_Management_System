import React, { useState } from "react";
import axios from "axios";
import "./StudentRegistrationFlow.css";

function StudentRegistrationFlow() {
    const [step, setStep] = useState(1);
    const [studentData, setStudentData] = useState({
        student_id: "",
        student_name: "",
        email: "",
        password: ""
    });
    
    const [academicData, setAcademicData] = useState({
        gpa: "",
        credits_completed: "",
        programming_concepts_percentage: "",
        algorithms_concepts_percentage: "",
        software_engineering_percentage: "",
        computer_network_percentage: "",
        electronic_subjects_percentage: "",
        computer_architecture_percentage: "",
        mathematics_percentage: "",
        communication_skills_percentage: "",
        operating_systems_percentage: ""
    });

    // const [projectData, setProjectData] = useState({
    //     project_id: "",
    //     project_name: "",
    //     domain_name: ""
    // });

    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState({
        project_name: "",
        domain_name: ""
    });

    // Modified to store array of skills
    const [skills, setSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState({
        skill_name: "",
        proficiency_level: "Beginner",
        certifications: ""
    });


    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAcademicChange = (e) => {
        const { name, value } = e.target;
        setAcademicData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleProjectChange = (e) => {
    //     const { name, value } = e.target;
    //     setProjectData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    
    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/add-student", studentData);
            alert("Student added successfully! Please add academic performance.");
            setStep(2);
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student.");
        }
    };

    const handleAcademicSubmit = async (e) => {
        e.preventDefault();
        try {
            const academicPayload = {
                ...academicData,
                student_id: studentData.student_id
            };
            
            const response = await axios.post("http://localhost:5001/add-academic-performance", academicPayload);
            alert("Academic performance added successfully! Please add project details.");
            setStep(3);
        } catch (error) {
            console.error("Error adding academic performance:", error);
            alert("Failed to add academic performance.");
        }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/add-projects", projectData);
            alert("Project added successfully!");
            
            // Reset all form data
            setStudentData({
                student_id: "",
                student_name: "",
                email: "",
                password: ""
            });
            setAcademicData({
                gpa: "",
                credits_completed: "",
                programming_concepts_percentage: "",
                algorithms_concepts_percentage: "",
                software_engineering_percentage: "",
                computer_network_percentage: "",
                electronic_subjects_percentage: "",
                computer_architecture_percentage: "",
                mathematics_percentage: "",
                communication_skills_percentage: "",
                operating_systems_percentage: ""
            });
            setProjectData({
                project_id: "",
                project_name: "",
                domain_name: ""
            });
            setStep(4);
        } catch (error) {
            console.error("Error adding project:", error);
            alert("Failed to add project.");
        }
    };

    // const [skillsData, setSkillsData] = useState({
    //     skill_id: "",
    //     skill_name: "",
    //     proficiency_level: "Beginner", // Default value
    //     certifications: ""
    // });

    // Update the step state to include skills
    // const [step, setStep] = useState(1); // Now goes up to 4

    const handleSkillsChange = (e) => {
        const { name, value } = e.target;
        setSkillsData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillsSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/add-skills", skillsData);
            alert("Skills added successfully!");
            // Reset form and go back to step 1
            setSkillsData({
                skill_id: "",
                skill_name: "",
                proficiency_level: "Beginner",
                certifications: ""
            });
            setStep(1);
        } catch (error) {
            console.error("Error adding skills:", error);
            alert("Failed to add skills.");
        }
    };

    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillChange = (e) => {
        const { name, value } = e.target;
        setCurrentSkill(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addProject = async () => {
        if (currentProject.project_name) {
            try {
                const response = await axios.post("http://localhost:5001/add-projects", {
                    ...currentProject,
                    student_id: studentData.student_id
                });
                
                // Add the project to the local state with the generated ID
                setProjects(prev => [...prev, {
                    ...currentProject,
                    project_id: response.data.project_id
                }]);
                
                // Reset the form
                setCurrentProject({
                    project_name: "",
                    domain_name: ""
                });
            } catch (error) {
                console.error("Error adding project:", error);
                alert("Failed to add project.");
            }
        }
    };
    const removeProject = (index) => {
        setProjects(prev => prev.filter((_, i) => i !== index));
    };

    const addSkill = async () => {
        if (currentSkill.skill_name) {
            try {
                const response = await axios.post("http://localhost:5001/add-skills", {
                    ...currentSkill,
                    student_id: studentData.student_id
                });
                
                // Add the skill to the local state with the generated ID
                setSkills(prev => [...prev, {
                    ...currentSkill,
                    skill_id: response.data.skill_id
                }]);
                
                // Reset the form
                setCurrentSkill({
                    skill_name: "",
                    proficiency_level: "Beginner",
                    certifications: ""
                });
            } catch (error) {
                console.error("Error adding skill:", error);
                alert("Failed to add skill.");
            }
        }
    };
    

    const removeSkill = (index) => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitAll = async () => {
        try {
        //     // Submit student data
        //     await axios.post("http://localhost:5001/add-student", studentData);
            
        //     // Submit academic data
        //     const academicPayload = {
        //         ...academicData,
        //         student_id: studentData.student_id
        //     };
        //     await axios.post("http://localhost:5001/add-academic-performance", academicPayload);
            
            // Submit all projects
            for (const project of projects) {
                await axios.post("http://localhost:5001/add-projects", {
                    ...project,
                    student_id: studentData.student_id
                });
            }
            
            // Submit all skills
            for (const skill of skills) {
                await axios.post("http://localhost:5001/add-skills", {
                    ...skill,
                    student_id: studentData.student_id
                });
            }
            
            alert("All data submitted successfully!");
            // Reset all forms
            resetAllForms();
            setStep(1);
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Error submitting data. Please try again.");
        }
    };

    const resetAllForms = () => {
        setStudentData({
            student_id: "",
            student_name: "",
            email: "",
            password: ""
        });
        setAcademicData({
            gpa: "",
            credits_completed: "",
            programming_concepts_percentage: "",
            algorithms_concepts_percentage: "",
            software_engineering_percentage: "",
            computer_network_percentage: "",
            electronic_subjects_percentage: "",
            computer_architecture_percentage: "",
            mathematics_percentage: "",
            communication_skills_percentage: "",
            operating_systems_percentage: ""
        });
        setProjects([]);
        setSkills([]);
        setCurrentProject({
            project_id: "",
            project_name: "",
            domain_name: ""
        });
        setCurrentSkill({
            skill_id: "",
            skill_name: "",
            proficiency_level: "Beginner",
            certifications: ""
        });
    };
    

    return (
        <div className="academic-performance-container">
            <div className="progress-indicator">
                <div className="progress-bar">
                    {[1, 2, 3, 4].map((number) => (
                        <div
                            key={number}
                            className={`progress-step ${step >= number ? 'active' : ''}`}
                        >
                            {number}
                        </div>
                    ))}
                    <div className="progress-line"></div>
                </div>
            </div>

            {step === 1 && (
                <form onSubmit={handleStudentSubmit} className="registration-form">
                    <h2>Student Registration</h2>
                    
                    <div className="form-field">
                        <label>
                            Student ID:
                            <input
                                type="number"
                                name="student_id"
                                value={studentData.student_id}
                                onChange={handleStudentChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Student Name:
                            <input
                                type="text"
                                name="student_name"
                                value={studentData.student_name}
                                onChange={handleStudentChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={studentData.email}
                                onChange={handleStudentChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={studentData.password}
                                onChange={handleStudentChange}
                                required
                            />
                        </label>
                    </div>

                    <button type="submit" className="submit-button">Next: Add Academic Performance</button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleAcademicSubmit} className="registration-form">
                    <h2>Academic Performance for {studentData.student_name}</h2>
                    
                    <div className="form-field">
                        <label>
                            GPA:
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="4.0"
                                name="gpa"
                                value={academicData.gpa}
                                onChange={handleAcademicChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Credits Completed:
                            <input
                                type="number"
                                name="credits_completed"
                                value={academicData.credits_completed}
                                onChange={handleAcademicChange}
                                required
                            />
                        </label>
                    </div>

                    {[
                        ["Programming Concepts", "programming_concepts_percentage"],
                        ["Algorithms Concepts", "algorithms_concepts_percentage"],
                        ["Software Engineering", "software_engineering_percentage"],
                        ["Computer Network", "computer_network_percentage"],
                        ["Electronic Subjects", "electronic_subjects_percentage"],
                        ["Computer Architecture", "computer_architecture_percentage"],
                        ["Mathematics", "mathematics_percentage"],
                        ["Communication Skills", "communication_skills_percentage"],
                        ["Operating Systems", "operating_systems_percentage"]
                    ].map(([label, name]) => (
                        <div key={name} className="form-field">
                            <label>
                                {label} Percentage:
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    name={name}
                                    value={academicData[name]}
                                    onChange={handleAcademicChange}
                                    required
                                />
                            </label>
                        </div>
                    ))}

                    <div className="button-group">
                        <button type="button" onClick={() => setStep(1)} className="back-button">
                            Back
                        </button>
                        <button type="submit" className="submit-button">
                            Next: Add Project Details
                        </button>
                    </div>
                </form>
            )}

            {/* {step === 3 && (
                <form onSubmit={handleProjectSubmit} className="registration-form">
                    <h2>Project Details</h2>
                    
                    <div className="form-field">
                        <label>
                            Project ID:
                            <input
                                type="text"
                                name="project_id"
                                value={projectData.project_id}
                                onChange={handleProjectChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Project Name:
                            <input
                                type="text"
                                name="project_name"
                                value={projectData.project_name}
                                onChange={handleProjectChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Domain Name:
                            <input
                                type="text"
                                name="domain_name"
                                value={projectData.domain_name}
                                onChange={handleProjectChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={() => setStep(2)} className="back-button">
                            Back
                        </button>
                        <button type="submit" className="submit-button">
                            Submit Project Details
                        </button>
                    </div>
                </form>
            )} */}

    {/* {step === 4 && (
            <form onSubmit={handleSkillsSubmit} className="registration-form">
                <h2>Skills Information</h2>
                
                <div className="form-field">
                    <label>
                        Skill ID:
                        <input
                            type="number"
                            name="skill_id"
                            value={skillsData.skill_id}
                            onChange={handleSkillsChange}
                            required
                        />
                    </label>
                </div>

                <div className="form-field">
                    <label>
                        Skill Name:
                        <input
                            type="text"
                            name="skill_name"
                            value={skillsData.skill_name}
                            onChange={handleSkillsChange}
                            required
                        />
                    </label>
                </div>

                <div className="form-field">
                    <label>
                        Proficiency Level:
                        <select
                            name="proficiency_level"
                            value={skillsData.proficiency_level}
                            onChange={handleSkillsChange}
                            required
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </label>
                </div>

                <div className="form-field">
                    <label>
                        Certifications:
                        <input
                            type="text"
                            name="certifications"
                            value={skillsData.certifications}
                            onChange={handleSkillsChange}
                            placeholder="Enter certification details (if any)"
                        />
                    </label>
                </div>

                <div className="button-group">
                    <button type="button" onClick={() => setStep(3)} className="back-button">
                        Back
                    </button>
                    <button type="submit" className="submit-button">
                        Submit Skills
                    </button>
                </div>
            </form>
        )} */}

{step === 3 && (
                <div className="registration-form">
                    <h2>Project Details for {studentData.student_name}</h2>
                    
                    {/* Display added projects */}
                    {projects.length > 0 && (
                        <div className="added-items-list">
                            <h3>Added Projects:</h3>
                            {projects.map((project, index) => (
                                <div key={index} className="item-card">
                                    <div className="item-details">
                                        <strong>{project.project_name}</strong>
                                        <span>Domain: {project.domain_name}</span>
                                        {/* <span>ID: {project.project_id}</span> */}
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeProject(index)}
                                        className="remove-item-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Project input form */}
                    {/* <div className="form-field">
                        <label>
                            Project ID:
                            <input
                                type="text"
                                name="project_id"
                                value={currentProject.project_id}
                                onChange={handleProjectChange}
                                required
                            />
                        </label>
                    </div> */}

                    <div className="form-field">
                        <label>
                            Project Name:
                            <input
                                type="text"
                                name="project_name"
                                value={currentProject.project_name}
                                onChange={handleProjectChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Domain Name:
                            <input
                                type="text"
                                name="domain_name"
                                value={currentProject.domain_name}
                                onChange={handleProjectChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={addProject} className="add-item-button">
                            Add Project
                        </button>
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={() => setStep(2)} className="back-button">
                            Back
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep(4)} 
                            className="next-button"
                            disabled={projects.length === 0}
                        >
                            Next: Add Skills
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="registration-form">
                    <h2>Skills Information for {studentData.student_name}</h2>
                    
                    {/* Display added skills */}
                    {skills.length > 0 && (
                        <div className="added-items-list">
                            <h3>Added Skills:</h3>
                            {skills.map((skill, index) => (
                                <div key={index} className="item-card">
                                    <div className="item-details">
                                        <strong>{skill.skill_name}</strong>
                                        <span>Level: {skill.proficiency_level}</span>
                                        {skill.certifications && (
                                            <span>Cert: {skill.certifications}</span>
                                        )}
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeSkill(index)}
                                        className="remove-item-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skill input form */}
                    {/* <div className="form-field">
                        <label>
                            Skill ID:
                            <input
                                type="text"
                                name="skill_id"
                                value={currentSkill.skill_id}
                                onChange={handleSkillChange}
                                required
                            />
                        </label>
                    </div> */}

                    <div className="form-field">
                        <label>
                            Skill Name:
                            <input
                                type="text"
                                name="skill_name"
                                value={currentSkill.skill_name}
                                onChange={handleSkillChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Proficiency Level:
                            <select
                                name="proficiency_level"
                                value={currentSkill.proficiency_level}
                                onChange={handleSkillChange}
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </label>
                    </div>

                    <div className="form-field">
                        <label>
                            Certifications:
                            <input
                                type="text"
                                name="certifications"
                                value={currentSkill.certifications}
                                onChange={handleSkillChange}
                                placeholder="Enter certification details (if any)"
                            />
                        </label>
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={addSkill} className="add-item-button">
                            Add Skill
                        </button>
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={() => setStep(3)} className="back-button">
                            Back
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmitAll} 
                            className="submit-button"
                            disabled={skills.length === 0}
                        >
                            Submit All Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentRegistrationFlow;