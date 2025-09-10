import React from "react";
import Header from "./Header";
import djphoto from "../imgs/dj.jpg"
import "./AboutMe.css"
import {Profile} from "./MainPage";

const AboutMe = () => {
return (
<div className="lect_notes_main_cont">
  <Header active="about_me" />
  <div className="lect_notes_main_cont_inner">
    <div className="section aboutme-section first-text-about-me">
      <h2 className="name_about_me">Yehor KOROTENKO (dobbikov)</h2>
      <h2 className="section-title aboutme-section-title">Summary</h2>
      <p className="aboutme-text">
        <p>High qualified Software Engineer with over <strong>five years</strong> of experience across research, freelance, and industry settings. Adept at developing full-stack applications, building automation tools, and contributing to open-source projects. </p>
        <p>Currently focused on <em>machine translation</em> and <em>scientific tooling</em>. Known for rapid learning, deep curiosity, and a strong commitment to building meaningful, high-impact software.</p>
      </p>
    </div>

    <div className="section aboutme-section">
      <h2 className="section-title aboutme-section-title">Education</h2>
      <p className="aboutme-text">
        <strong>Université Paris-Saclay</strong> – Dual Degree in Mathematics and Computer Science (Sept 2023 – May 2026)
      </p>
      <p className="aboutme-text">
        <strong>GPA</strong>: 18.0/20 (Top 2 of 57 students) | Honors: FMJH Scholarship
      </p>
      <p className="aboutme-text">
        <strong>Relevant Coursework</strong>: Calculus, Analysis, Linear Algebra, Abstract Algebra &amp; Group Theory, Probability &amp; Statistics, Algorithmics &amp; Data Structures, Functional Programming, Topology, Graphical Programming
      </p>
    </div>

    <div className="section aboutme-section">
      <h2 className="section-title aboutme-section-title">Technical Skills</h2>
      <p className="aboutme-text"><strong>Programming Languages:</strong> Python, Rust, OCaml, C++, C#, JavaScript</p>
      <p className="aboutme-text"><strong>Web Development:</strong> ASP.NET Core, Angular, React, MySQL</p>
      <p className="aboutme-text"><strong>Data Science:</strong> Pandas, Matplotlib, NumPy, scikit-learn</p>
      <p className="aboutme-text"><strong>Other Tools:</strong> Requests, Selenium, SQL</p>
      <p className="aboutme-text"><strong>Version Control:</strong> Git, GitHub, GitLab</p>
    </div>

    <div className="section aboutme-section">
      <h2 className="section-title aboutme-section-title">Experience</h2>
      <p className="aboutme-text">
        <strong><a className="lisn-link" href="https://www.lisn.upsaclay.fr/">LISN</a>, Research Intern</strong> (May 2025 – July 2025) – Leveraging adaptive machine translation to assist collaborative authoring and maintenance of large multilingual computational scientific narratives.
      </p>
      <p className="aboutme-text">
        <strong>DevDJsUa, Software Engineer</strong> (June 2021 – December 2021) – Built scalable full-stack applications and interactive tools for clients,
        specializing in custom solutions including CRM systems and user-facing bots.
      </p>
      <p className="aboutme-text">
        <strong>Freelance, Software Engineer</strong> (January 2021 – February 2022) – Developed full-stack web applications using JavaScript, C#, React, and Angular.
        Designed and implemented multiple Telegram bots for automation and user interaction.
      </p>
    </div>

    <div className="section aboutme-section">
      <h2 className="section-title aboutme-section-title">Projects</h2>
      <div className="projects-container">
        <div className="project-item">
          <div className="project-info">
            <strong>Sci-trans-git</strong> - a research based toolchain to maintain multilingual documents with style and syntax preservance.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/sci-trans-git" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>LogGit</strong> - a lightweight, easy-to-use logging library for Rust.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/loggit" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Parse Dir Contents</strong> - a CLI application for directory contents extraction to simplify the working process with LLMs.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/parse_directory_contents" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Open DiGraph Lib</strong> - a library for managing graphs and boolean circuits.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/open_digraph_lib" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
                <div className="project-item">
          <div className="project-info">
            <strong>Oxford Dict. Lib/Bot</strong> - a library and a telegram bot for simplifying English learning process.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/oxford-dictionary-lib" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Full-Stack CRM for Scout Organization:</strong> Built a functional CRM using C#, ASP.NET Core, Entity Framework, MySQL, and Angular.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/sdSite" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Telegram Bot for Track Sorting:</strong> Designed a bot to categorize tracks by tonality using Python.
          </div>
          <a className="project-link" href="https://github.com/DevDJsUA/key-sort-app" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>GTA Online GameMode:</strong> Developed a 30,000+ line game mode in Pawn, incorporating CRM functionalities, SQL, and algorithms.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/crmpmode" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>University Timetable Bot:</strong> Created a bot to parse PDF files and assist users with scheduling using Python.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/paris-saclay-bot" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Neural Networks in Rust:</strong> Built neural networks from scratch to explore machine learning concepts.
          </div>
          <a className="project-link" href="https://github.com/DobbiKov/neural-network-rust" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Image Recognition Project:</strong> Conducted image recognition experiments using Python, Pandas, Matplotlib, NumPy, and scikit-learn.
          </div>
        </div>
        <div className="project-item">
          <div className="project-info">
            <strong>Web Scraping Scripts:</strong> Automated data collection processes with Python, Selenium, and Requests.
          </div>
        </div>
      </div>
    </div>

    <div className="section aboutme-section">
      <h2 className="section-title aboutme-section-title">Languages</h2>
      <p className="aboutme-text"><strong>Fluent:</strong> English🇬🇧, French🇫🇷</p>
      <p className="aboutme-text"><strong>Native:</strong> Ukrainian🇺🇦, Russian🏴‍☠️</p>
    </div>

    <div className="section aboutme-section">
      <h2 className="section-title aboutme-section-title">Interests &amp; Extracurricular Activities</h2>
      <p className="aboutme-text">
        <strong>Scouting Leader:</strong> Active scout since age 12, organizing and participating in international events.
      </p>
      <p className="aboutme-text">
        <p><strong>DJing Enthusiast:</strong> Enjoys creating music and performing as a DJ during free time.</p>
        <div className="dj_div">
          <div className="dj_inner">
            <img src={djphoto} alt="DJing" className='dj_photo'/>
          </div>
          <p className="dj_div-caption">Performing my Drum and Bass set in Dnipro, Ukraine (June 2023)</p>
        </div>
      </p>
    </div>
  </div>
</div>
);
};

export default AboutMe;